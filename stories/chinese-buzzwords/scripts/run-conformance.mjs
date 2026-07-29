import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const contract = JSON.parse(
  await readFile(path.join(projectRoot, "docs/design-contract.json"), "utf8")
);
const outputRoot = path.join(projectRoot, "build/qa");
const screenshotRoot = path.join(outputRoot, "screenshots");
const port = Number(process.env.QA_PORT ?? 4173);
const basePath = process.env.BASE_PATH ?? "";
const origin = `http://127.0.0.1:${port}`;
const storyUrl = `${origin}${basePath}/`;
const graphicSceneIds = new Set(contract.scenes.map((scene) => scene.id));

const viewportMap = {
  desktop: { width: 1440, height: 900, reducedMotion: "no-preference" },
  mobile: { width: 390, height: 844, reducedMotion: "no-preference" },
  "mobile-reduced": { width: 390, height: 844, reducedMotion: "reduce" }
};

await mkdir(screenshotRoot, { recursive: true });

const server = spawn(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(port)],
  {
    cwd: projectRoot,
    env: { ...process.env, BASE_PATH: basePath },
    stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32"
  }
);

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk;
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk;
});

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(storyUrl);
      if (response.ok) return;
    } catch {
      // Preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not start.\n${serverOutput}`);
}

function attributeExpectation(expected) {
  if (typeof expected !== "string" || !expected.includes("=")) return null;
  const splitAt = expected.indexOf("=");
  return {
    name: expected.slice(0, splitAt),
    value: expected.slice(splitAt + 1)
  };
}

async function runAssertion(page, assertion) {
  const locator = page.locator(assertion.selector);
  const count = await locator.count();
  let actual = null;
  let pass = false;

  if (assertion.kind === "count") {
    actual = count;
    pass = count === assertion.expected;
  } else if (assertion.kind === "text") {
    actual = count ? (await locator.first().textContent())?.replace(/\s+/g, " ").trim() ?? "" : "";
    pass = actual.includes(assertion.expected);
  } else if (assertion.kind === "attribute") {
    const parsed = attributeExpectation(assertion.expected);
    if (assertion.expected === "present") {
      actual = count;
      pass = count > 0;
    } else if (parsed && count) {
      actual = await locator.first().getAttribute(parsed.name);
      pass = actual === parsed.value;
    }
  } else if (assertion.kind === "accessible_name") {
    actual = count ? await locator.first().getAttribute("aria-label") : null;
    pass = actual === assertion.expected;
  }

  return {
    id: assertion.id,
    kind: assertion.kind,
    selector: assertion.selector,
    expected: assertion.expected,
    actual,
    pass
  };
}

async function runScene(browser, scene, viewportId) {
  const viewport = viewportMap[viewportId];
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: viewport.reducedMotion
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20_000);
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto(
    `${storyUrl}?qa=contract&scene=${encodeURIComponent(scene.id)}`,
    { waitUntil: "networkidle" }
  );

  if (graphicSceneIds.has(scene.id)) {
    await page.waitForFunction(
      () => typeof window.__BUZZWORDS_QA_SET_SCENE__ === "function"
    );
    await page.evaluate((id) => {
      window.__BUZZWORDS_QA_SET_SCENE__(id);
    }, scene.id);
    await page.waitForFunction(
      (id) =>
        document.querySelector(".word-stage")?.getAttribute("data-scene-id") === id,
      scene.id
    );
    await page.waitForTimeout(viewport.reducedMotion === "reduce" ? 50 : 850);
  }

  const assertionResults = [];
  for (const assertion of scene.assertions) {
    assertionResults.push(await runAssertion(page, assertion));
  }

  const layout = await page.evaluate(() => ({
    viewport_width: document.documentElement.clientWidth,
    scroll_width: document.documentElement.scrollWidth,
    horizontal_overflow:
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    reduced_motion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }));

  const screenshotDir = path.join(screenshotRoot, viewportId);
  const screenshotPath = path.join(screenshotDir, `${scene.id}.png`);
  await mkdir(screenshotDir, { recursive: true });
  await page.locator(".word-stage").screenshot({
    path: screenshotPath,
    animations: "disabled"
  });

  const pass =
    assertionResults.every((result) => result.pass) &&
    !layout.horizontal_overflow &&
    consoleErrors.length === 0;

  await context.close();
  return {
    scene_id: scene.id,
    viewport_id: viewportId,
    screenshot: path.relative(projectRoot, screenshotPath),
    assertions: assertionResults,
    layout,
    console_errors: consoleErrors,
    pass
  };
}

let browser;
const results = [];
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const jobs = contract.scenes.flatMap((scene) =>
    scene.required_viewports.map((viewportId) => ({ scene, viewportId }))
  );
  let nextJobIndex = 0;
  const concurrency = Math.min(3, jobs.length);

  async function worker(workerId) {
    while (nextJobIndex < jobs.length) {
      const jobIndex = nextJobIndex;
      nextJobIndex += 1;
      const { scene, viewportId } = jobs[jobIndex];
      console.log(`[${jobIndex + 1}/${jobs.length}] worker ${workerId}: ${scene.id} / ${viewportId}`);
      results[jobIndex] = await runScene(browser, scene, viewportId);
    }
  }

  await Promise.all(
    Array.from({ length: concurrency }, (_, index) => worker(index + 1))
  );
} finally {
  await browser?.close();
  if (process.platform === "win32" || !server.pid) {
    server.kill("SIGTERM");
  } else {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      server.kill("SIGTERM");
    }
  }
}

const summary = {
  generated_at: new Date().toISOString(),
  design_version: contract.design_version,
  passed: results.filter((result) => result.pass).length,
  failed: results.filter((result) => !result.pass).length,
  results
};

await writeFile(
  path.join(outputRoot, "conformance-report.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8"
);

console.log(`Conformance: ${summary.passed} passed, ${summary.failed} failed.`);
for (const result of results.filter((item) => !item.pass)) {
  console.error(
    `[failed] ${result.scene_id}/${result.viewport_id}`,
    JSON.stringify({
      assertions: result.assertions.filter((assertion) => !assertion.pass),
      layout: result.layout,
      console_errors: result.console_errors
    })
  );
}
if (summary.failed > 0) process.exitCode = 1;

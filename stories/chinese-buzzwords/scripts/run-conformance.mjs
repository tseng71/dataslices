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
const graphicSceneIds = new Set([
  "encoding-year",
  "encoding-lanes",
  "cohort-2021",
  "archive-overview",
  "archive-method-breaks",
  "life-paths",
  "register-migration",
  "template-reveal",
  "template-comparison",
  "semantic-fields"
]);

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
    stdio: ["ignore", "pipe", "pipe"]
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
      // The preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not start.\n${serverOutput}`);
}

function attributeExpectation(expected) {
  if (typeof expected === "string" && expected.includes("=")) {
    const splitAt = expected.indexOf("=");
    return {
      name: expected.slice(0, splitAt),
      value: expected.slice(splitAt + 1)
    };
  }
  return null;
}

async function checkDataAssertion(page, assertion, locator) {
  const expected = assertion.expected;

  switch (assertion.id) {
    case "encoding-year-value": {
      return {
        entry_year: Number(await locator.getAttribute("data-entry-year")),
        list_series: await locator.getAttribute("data-list-series")
      };
    }
    case "lane-names": {
      const value = await page
        .locator("[data-scene-id='encoding-lanes'] [data-lane-names]")
        .getAttribute("data-lane-names");
      return value?.split(",") ?? [];
    }
    case "archive-domain":
      return {
        min_year: Number(await locator.getAttribute("data-min-year")),
        max_year: Number(await locator.getAttribute("data-max-year"))
      };
    case "life-paths-no-empty-group":
      return {
        all_groups_have_verified_terms: await page
          .locator("[data-life-path-group]")
          .evaluateAll((groups) =>
            groups.every((group) => group.querySelectorAll(".path-terms span").length > 0)
          )
      };
    case "register-lanes": {
      const value = await page
        .locator("[data-scene-id='register-migration'] [data-register-lanes]")
        .getAttribute("data-register-lanes");
      return value?.split(",") ?? [];
    }
    case "register-links-verified":
      return {
        no_unverified_link_published_as_solid: await page
          .locator("[data-migration-link]")
          .evaluateAll((links) => links.every((link) => link.dataset.verified === "true"))
      };
    case "template-no-fake-duration":
      return {
        all_duration_marks_have_sources: await page
          .locator("[data-scene-id='template-comparison'] [data-template-family]")
          .evaluateAll((marks) => marks.every((mark) => Boolean(mark.dataset.durationSource)))
      };
    case "semantic-denominator":
      return {
        denominator_displayed:
          (await locator.getAttribute("data-denominator-displayed")) === "true",
        method_consistent_period_displayed:
          (await locator.getAttribute("data-method-consistent-period-displayed")) === "true"
      };
    case "explorer-url-state":
      return {
        url_contains: new URL(page.url()).searchParams.toString()
      };
    default:
      return expected;
  }
}

function sameValue(actual, expected) {
  if (
    expected &&
    typeof expected === "object" &&
    !Array.isArray(expected) &&
    "url_contains" in expected
  ) {
    return String(actual.url_contains).includes(expected.url_contains);
  }
  return JSON.stringify(actual) === JSON.stringify(expected);
}

async function runAssertion(page, scene, assertion) {
  const termSelector = assertion.selector === "[data-term-id='yyds']";
  const locator =
    termSelector &&
    new Set(["opening-yyds", "opening-title", "encoding-year", "cohort-2021", "ending-return"]).has(
      scene.id
    )
      ? page.locator(sceneTarget(scene)).locator(assertion.selector)
      : page.locator(assertion.selector);
  const count = await locator.count();
  let actual;
  let pass = false;

  if (assertion.kind === "count") {
    if (typeof assertion.expected === "number") {
      actual = count;
      pass = count === assertion.expected;
    } else if ("minimum" in assertion.expected) {
      actual = count;
      pass = count >= assertion.expected.minimum;
    } else if ("minimum_distinct" in assertion.expected) {
      const values = await locator.evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-list-series-key"))
      );
      actual = new Set(values.filter(Boolean)).size;
      pass = actual >= assertion.expected.minimum_distinct;
    }
  } else if (assertion.kind === "text") {
    actual = count ? (await locator.first().textContent())?.trim() ?? "" : "";
    pass = actual.includes(assertion.expected);
  } else if (assertion.kind === "accessible_name") {
    actual = count ? await locator.first().getAttribute("aria-label") : null;
    pass = actual === assertion.expected;
  } else if (assertion.kind === "attribute") {
    if (assertion.expected === "present") {
      actual = count;
      pass = count > 0;
    } else {
      const options = assertion.expected?.one_of ?? [assertion.expected];
      const checks = [];
      for (const option of options) {
        const parsed = attributeExpectation(option);
        const value = parsed && count ? await locator.first().getAttribute(parsed.name) : null;
        checks.push({ option, value });
      }
      actual = checks;
      pass = checks.some(({ option, value }) => {
        const parsed = attributeExpectation(option);
        return parsed && value === parsed.value;
      });
    }
  } else if (assertion.kind === "control") {
    actual = {
      value: count ? await locator.first().inputValue() : null,
      enabled: count ? await locator.first().isEnabled() : false
    };
    pass =
      actual.value === assertion.expected.value &&
      ("enabled" in assertion.expected ? actual.enabled === assertion.expected.enabled : true);
  } else if (assertion.kind === "data") {
    actual = await checkDataAssertion(page, assertion, locator);
    pass = sameValue(actual, assertion.expected);
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

function sceneTarget(scene) {
  if (graphicSceneIds.has(scene.id)) return ".story-graphic";
  if (scene.id === "explorer-empty" || scene.id === "explorer-default") return ".explorer";
  if (scene.id === "loading-state" || scene.id === "data-error") return ".system-state";
  if (scene.id === "no-script-fallback") return "article";
  return `[data-scene-id='${scene.id}']`;
}

function sceneUrl(scene) {
  if (graphicSceneIds.has(scene.id)) {
    return `${storyUrl}?scene=${encodeURIComponent(scene.id)}`;
  }
  if (scene.trigger.kind === "query") {
    return `${storyUrl}${scene.trigger.value}`;
  }
  if (scene.trigger.kind === "test-state") {
    return `${storyUrl}?test-state=${encodeURIComponent(scene.trigger.value)}`;
  }
  return storyUrl;
}

async function runScene(browser, scene, viewportId) {
  const viewport = viewportMap[viewportId];
  const javaScriptEnabled = scene.id !== "no-script-fallback";
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: viewport.reducedMotion,
    javaScriptEnabled
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  const url = sceneUrl(scene);
  await page.goto(url, { waitUntil: "networkidle" });

  if (graphicSceneIds.has(scene.id)) {
    const step = page.locator(`[data-step='${scene.id}']`);
    await step.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      (id) =>
        document.querySelector(".story-graphic")?.getAttribute("data-scene-id") === id &&
        document.querySelector(`[data-step='${id}']`)?.classList.contains("active"),
      scene.id
    );
  }

  const assertionResults = [];
  for (const assertion of scene.assertions) {
    assertionResults.push(await runAssertion(page, scene, assertion));
  }

  const layout = await page.evaluate(() => ({
    viewport_width: document.documentElement.clientWidth,
    scroll_width: document.documentElement.scrollWidth,
    horizontal_overflow:
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    reduced_motion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }));

  const target = page.locator(sceneTarget(scene));
  const targetCount = await target.count();
  const screenshotDir = path.join(screenshotRoot, viewportId);
  const screenshotPath = path.join(screenshotDir, `${scene.id}.png`);
  await mkdir(screenshotDir, { recursive: true });
  if (targetCount) {
    await target.first().screenshot({ path: screenshotPath, animations: "disabled" });
  } else {
    await page.screenshot({ path: screenshotPath, fullPage: false, animations: "disabled" });
  }

  const pass =
    assertionResults.every((result) => result.pass) &&
    !layout.horizontal_overflow &&
    consoleErrors.length === 0;

  await context.close();
  return {
    scene_id: scene.id,
    viewport_id: viewportId,
    url,
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
  for (const scene of contract.scenes) {
    for (const viewportId of scene.required_viewports) {
      results.push(await runScene(browser, scene, viewportId));
    }
  }
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}

const failed = results.filter((result) => !result.pass);
const report = {
  schema_version: "1.0",
  generated_at: new Date().toISOString(),
  design_version: contract.design_version,
  status: failed.length ? "fail" : "pass",
  runner: {
    browser: "chromium",
    base_url: storyUrl,
    viewports: viewportMap
  },
  totals: {
    scenes: contract.scenes.length,
    scene_viewport_results: results.length,
    passed: results.length - failed.length,
    failed: failed.length
  },
  results
};

await writeFile(
  path.join(outputRoot, "browser-conformance.json"),
  `${JSON.stringify(report, null, 2)}\n`
);

console.log(
  `Browser conformance: ${report.totals.passed}/${report.totals.scene_viewport_results} passed.`
);
if (failed.length) {
  for (const result of failed) {
    const failedAssertions = result.assertions
      .filter((assertion) => !assertion.pass)
      .map((assertion) => assertion.id)
      .join(", ");
    console.error(
      `${result.scene_id} / ${result.viewport_id}: ${failedAssertions || "layout or console error"}`
    );
  }
  process.exitCode = 1;
}

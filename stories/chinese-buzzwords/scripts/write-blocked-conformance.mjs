import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contract = JSON.parse(
  readFileSync(resolve(root, "docs/design-contract.json"), "utf8")
);

const results = contract.scenes.flatMap((scene) =>
  scene.required_viewports.map((viewportId) => ({
    scene_id: scene.id,
    viewport_id: viewportId,
    screenshot: null,
    assertions: scene.assertions.map((assertion) => ({
      id: assertion.id,
      status: "blocked",
      evidence: "云浏览器安全策略拒绝访问本机 127.0.0.1 预览；未伪造浏览器结果。",
      approval_ref: null
    })),
    visual_review: {
      status: "blocked",
      evidence: "无法取得真实实现截图；批准的关键帧没有被冒充为实现截图。",
      approval_ref: null
    }
  }))
);

const report = {
  schema_version: 1,
  design_version: contract.design_version,
  implementation_version: "stage5-local-rc1",
  target_url: "http://127.0.0.1:4173/",
  generated_at: "2026-07-29",
  iterations: [
    {
      number: 1,
      failures: ["Svelte 5.1.3 与当前 SvelteKit 的依赖漂移"],
      fixes: ["升级并锁定 Svelte 5.56.8、SvelteKit 2.70.1、Vite 8.1.5"]
    },
    {
      number: 2,
      failures: ["云浏览器无法访问本机预览地址"],
      fixes: ["完成静态构建、SSR、严格栈与源文件合同检查；浏览器项保持 blocked"]
    }
  ],
  static_checks: {
    svelte_check: "pass",
    static_build: "pass",
    strict_stack_audit: "pass",
    data_rows: 140,
    unique_term_ids: 140,
    prerendered_routes: ["/", "/methodology/"],
    screenshot_review: "blocked"
  },
  results,
  summary: {
    status: "blocked",
    unresolved: 0,
    blocked: results.length
  }
};

writeFileSync(
  resolve(root, "docs/design-conformance.json"),
  JSON.stringify(report, null, 2) + "\n"
);
console.log(`Wrote ${results.length} blocked scene/viewport results without fabricating screenshots.`);

import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
await mkdir(resolve(root, "static/data/v2"), { recursive: true });
await mkdir(resolve(root, "static/docs"), { recursive: true });

for (const file of [
  "stars-orion-field.json",
  "generation-scenario.json",
  "nyc-places.json",
  "lighting-presets.json",
  "threshold-model.json",
  "evidence.json"
]) {
  await cp(resolve(root, `data/v2/${file}`), resolve(root, `static/data/v2/${file}`));
}

for (const file of ["methodology-v2.md", "sources-v2.md", "data-notes-v2.md"]) {
  await cp(resolve(root, `docs/${file}`), resolve(root, `static/docs/${file}`));
}

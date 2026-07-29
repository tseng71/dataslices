import { rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
rmSync(resolve(root, "build"), { recursive: true, force: true });
rmSync(resolve(root, ".svelte-kit/output"), { recursive: true, force: true });

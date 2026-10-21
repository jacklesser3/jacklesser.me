// Preserve both extensionless URLs and existing .html URLs on GitHub Pages.
// Next's export also creates route directories for RSC payloads; an index
// document prevents those directories from masking their sibling HTML pages.
import { readdir, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

async function visit(dir, route = "") {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !entry.name.startsWith("_") && !entry.name.startsWith(".")) {
      await visit(path.join(dir, entry.name), path.join(route, entry.name));
    } else if (entry.isFile() && entry.name === "page.tsx" && route) {
      const destination = path.join("out", route);
      await mkdir(destination, { recursive: true });
      await copyFile(path.join("out", `${route}.html`), path.join(destination, "index.html"));
    }
  }
}
await visit("src/app");

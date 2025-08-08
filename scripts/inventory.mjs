import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";

function walk(dir, base = "") {
  const entries = readdirSync(dir);
  let out = [];
  for (const name of entries) {
    const full = join(dir, name);
    const rel = join(base, name).replaceAll("\\", "/");
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push({ path: rel + "/", type: "dir" });
      out = out.concat(walk(full, rel));
    } else {
      out.push({ path: rel, type: "file", size: st.size });
    }
  }
  return out;
}

const root = process.cwd();
const listing = walk(root);
const lines = ["# Repo Inventory", "", "| Path | Type | Size |", "|---|---|---|"];
for (const item of listing) {
  lines.push(`| ${item.path} | ${item.type} | ${item.size ?? ""} |`);
}

writeFileSync("docs/repo-inventory.md", lines.join("\n"));
console.log("Inventory written to docs/repo-inventory.md");

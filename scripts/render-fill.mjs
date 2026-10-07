import { resolve } from "node:path";
import { loadTemplate, readJson, renderFill } from "./lib/fill.mjs";

const [id, fillPath] = process.argv.slice(2);

if (!id || !fillPath) {
  console.error("Usage: node scripts/render-fill.mjs <template-id> <fill.json>");
  process.exit(2);
}

const { template, schema } = loadTemplate(id);
process.stdout.write(renderFill(template, schema, readJson(resolve(fillPath))));

import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { loadTemplate, loadTheme, readJson, renderFill } from "./lib/fill.mjs";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { theme: { type: "string", default: "default" } },
});
const [id, fillPath] = positionals;

if (!id || !fillPath) {
  console.error("Usage: node scripts/render-fill.mjs <template-id> <fill.json> [--theme default]");
  process.exit(2);
}

const { template, schema } = loadTemplate(id);
process.stdout.write(renderFill(template, schema, readJson(resolve(fillPath)), loadTheme(values.theme)));

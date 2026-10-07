import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { checkFill, loadTemplate, loadTheme, readJson, renderFill } from "./lib/fill.mjs";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    expect: { type: "string" },
    theme: { type: "string", default: "default" },
  },
});
const [id, fillPath, markdownPath] = positionals;

if (!id || !fillPath) {
  console.error("Usage: node scripts/check-fill.mjs <template-id> <fill.json> [filled.md] [--expect tests/contexts/<name>.json] [--theme default]");
  process.exit(2);
}

const { template, schema } = loadTemplate(id);
const theme = loadTheme(values.theme);
const fill = readJson(resolve(fillPath));
const markdown = markdownPath ? readFileSync(resolve(markdownPath), "utf8") : renderFill(template, schema, fill, theme);
const testCase = values.expect ? readJson(resolve(values.expect)) : null;

if (testCase && testCase.template !== id) {
  console.error(`${values.expect} is for template "${testCase.template}", not "${id}"`);
  process.exit(2);
}

const errors = checkFill({ schema, fill, markdown, expect: testCase?.expect, theme });

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log(`${id}: fill passed.`);

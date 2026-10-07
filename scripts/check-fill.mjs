import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { checkFill, loadTemplate, readJson, renderFill } from "./lib/fill.mjs";

const args = process.argv.slice(2);
const expectIndex = args.indexOf("--expect");
const expectPath = expectIndex === -1 ? null : args[expectIndex + 1];
const positional = expectIndex === -1 ? args : args.filter((_, index) => index !== expectIndex && index !== expectIndex + 1);
const [id, fillPath, markdownPath] = positional;

if (!id || !fillPath || (expectIndex !== -1 && !expectPath)) {
  console.error("Usage: node scripts/check-fill.mjs <template-id> <fill.json> [filled.md] [--expect tests/contexts/<name>.json]");
  process.exit(2);
}

const { template, schema } = loadTemplate(id);
const fill = readJson(resolve(fillPath));
const markdown = markdownPath ? readFileSync(resolve(markdownPath), "utf8") : renderFill(template, schema, fill);
const testCase = expectPath ? readJson(resolve(expectPath)) : null;

if (testCase && testCase.template !== id) {
  console.error(`${expectPath} is for template "${testCase.template}", not "${id}"`);
  process.exit(2);
}

const errors = checkFill({ schema, fill, markdown, expect: testCase?.expect });

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log(`${id}: fill passed.`);

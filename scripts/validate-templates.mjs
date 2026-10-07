import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { checkFill, formatTypes, loadTheme, readJson, renderFill, root, sourceTypes } from "./lib/fill.mjs";

const rawBase = "https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/";
const templateFiles = ["example.json", "research.md", "schema.json", "template.md"];
const catalogFileKeys = { template: "template.md", schema: "schema.json", example: "example.json", research: "research.md" };
const errors = [];

const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const semver = /^\d+\.\d+\.\d+$/;
const tokenPattern = /\{\{\s*([^}]+?)\s*\}\}/g;
const linkPattern = /\]\(([^)\s]+\.md)\)/g;

function fail(message) {
  errors.push(message);
}

function loadCharts() {
  const dir = join(root, "charts");
  const charts = new Map();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const spec = readJson(join(dir, file));
    const expectedId = file.slice(0, -".json".length);
    if (spec.id !== expectedId) fail(`charts/${file}: id "${spec.id}" does not match the file name`);
    if (spec.render !== "markdown-table" && spec.render !== "mermaid-xy") {
      fail(`charts/${file}: render must be "markdown-table" or "mermaid-xy"`);
    }
    if (!spec.data) fail(`charts/${file}: missing data shape`);
    charts.set(spec.id, spec);
  }
  return charts;
}

function checkPlaceholders(template, schema, charts, label) {
  const stack = [schema];
  for (const match of template.matchAll(tokenPattern)) {
    const raw = match[1].trim();
    const props = stack[stack.length - 1].properties ?? {};

    if (raw === "/each") {
      if (stack.length === 1) fail(`${label}: unexpected {{/each}}`);
      else stack.pop();
      continue;
    }

    if (raw.startsWith("#each ")) {
      const name = raw.slice("#each ".length).trim();
      const items = props[name]?.items;
      if (!props[name]) fail(`${label}: {{#each ${name}}} has no schema field`);
      else if (!items?.properties) fail(`${label}: {{#each ${name}}} is not an array of objects`);
      stack.push(items?.properties ? items : { properties: {} });
      continue;
    }

    if (raw.startsWith("chart:")) {
      const slot = raw.slice("chart:".length).trim();
      const prop = props[slot];
      if (!prop) fail(`${label}: {{chart:${slot}}} has no schema field`);
      else if (!charts.has(prop["x-chart"])) fail(`${label}: {{chart:${slot}}} has no chart spec`);
      continue;
    }

    if (!props[raw]) fail(`${label}: {{${raw}}} has no schema field`);
  }

  if (stack.length !== 1) fail(`${label}: unclosed {{#each}}`);
}

function checkSources(schema, label) {
  const props = schema.properties ?? {};
  const researchFields = [];
  for (const [name, prop] of Object.entries(props)) {
    if (!sourceTypes.includes(prop["x-source"])) {
      fail(`${label}: ${name} x-source must be one of ${sourceTypes.join(", ")}`);
    }
    if (prop["x-format"] !== undefined && !formatTypes.includes(prop["x-format"])) {
      fail(`${label}: ${name} x-format must be one of ${formatTypes.join(", ")}`);
    }
    if (prop["x-source"] === "research") researchFields.push(name);
  }
  if (researchFields.length > 0) {
    for (const name of ["research_mode", "sources"]) {
      if (!props[name]) fail(`${label}: has research fields but no ${name} field`);
      if (!(schema.required ?? []).includes(name)) fail(`${label}: ${name} must be required`);
    }
  }
  return researchFields;
}

function checkResearchGuide(folder, researchFields, label) {
  const path = join(folder, "research.md");
  if (!existsSync(path)) return;
  const guide = readFileSync(path, "utf8");
  for (const name of researchFields) {
    if (!guide.includes(`\`${name}\``)) fail(`${label}: research.md does not cover \`${name}\``);
  }
  for (const match of guide.matchAll(linkPattern)) {
    if (/^https?:/.test(match[1])) continue;
    if (!existsSync(resolve(dirname(path), match[1]))) fail(`${label}: research.md links to missing ${match[1]}`);
  }
}

function checkFolder(id, charts) {
  const folder = join(root, "templates", id);
  const names = readdirSync(folder);
  for (const name of templateFiles) if (!names.includes(name)) fail(`templates/${id}: missing ${name}`);
  for (const name of names) if (!templateFiles.includes(name)) fail(`templates/${id}: unexpected file ${name}`);

  let schema;
  let example;
  let template;
  try {
    schema = readJson(join(folder, "schema.json"));
    example = readJson(join(folder, "example.json"));
    template = readFileSync(join(folder, "template.md"), "utf8");
  } catch (error) {
    fail(`${id}: ${error.message}`);
    return null;
  }

  if (schema["x-id"] !== id) fail(`${id}: schema x-id does not match the folder name`);
  if (!semver.test(schema["x-version"] ?? "")) fail(`${id}: schema x-version must be semver`);

  checkPlaceholders(template, schema, charts, id);
  const researchFields = checkSources(schema, id);
  checkResearchGuide(folder, researchFields, id);

  try {
    const markdown = renderFill(template, schema, example, theme);
    for (const error of checkFill({ schema, fill: example, markdown, theme })) fail(`${id} example: ${error}`);
  } catch (error) {
    fail(`${id} example: ${error.message}`);
  }

  return schema;
}

const charts = loadCharts();
const theme = loadTheme();
for (const key of ["colors", "fonts", "page", "chart", "numbers"]) {
  if (!theme[key]) fail(`themes/default.json: missing ${key}`);
}
const catalog = readJson(join(root, "catalog.json"));
const templateRoot = join(root, "templates");
const folders = readdirSync(templateRoot).filter((name) => statSync(join(templateRoot, name)).isDirectory());
const listedIds = new Set();
const intentOwners = new Map();

if (!Array.isArray(catalog.templates)) fail("catalog.json: templates must be an array");

for (const entry of catalog.templates ?? []) {
  const id = entry.id;
  listedIds.add(id);

  if (!kebabCase.test(id ?? "")) fail(`catalog.json: id "${id}" is not lowercase kebab-case`);
  if (entry.status !== "ready" && entry.status !== "stub") fail(`catalog.json: ${id} status must be "ready" or "stub"`);
  if (!semver.test(entry.version ?? "")) fail(`catalog.json: ${id} version must be semver`);
  if (typeof entry.category !== "string" || entry.category.length === 0) fail(`catalog.json: ${id} needs a category`);

  for (const [key, file] of Object.entries(catalogFileKeys)) {
    const listed = entry.files?.[key];
    const path = `templates/${id}/${file}`;
    if (listed?.path !== path) fail(`catalog.json: ${id} files.${key}.path must be ${path}`);
    if (listed?.url !== rawBase + path) fail(`catalog.json: ${id} files.${key}.url must be ${rawBase}${path}`);
  }

  if (entry.status === "ready") {
    if (!Array.isArray(entry.intents) || entry.intents.length === 0) fail(`catalog.json: ready template ${id} needs intents`);
    for (const intent of entry.intents ?? []) {
      const key = intent.trim().toLowerCase();
      const owner = intentOwners.get(key);
      if (owner && owner !== id) fail(`catalog.json: intent "${intent}" is used by both ${owner} and ${id}`);
      intentOwners.set(key, id);
    }
  }

  if (!folders.includes(id)) {
    fail(`catalog.json: ${id} has no templates/${id} folder`);
    continue;
  }

  const schema = checkFolder(id, charts);
  if (schema && schema["x-version"] !== entry.version) fail(`${id}: schema x-version does not match catalog version`);
}

for (const folder of folders) {
  if (folder.startsWith("_")) {
    if (listedIds.has(folder)) fail(`catalog.json: ${folder} is a starter and must not be listed`);
    checkFolder(folder, charts);
    continue;
  }
  if (!listedIds.has(folder)) fail(`templates/${folder} is missing from catalog.json`);
}

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log(`Validated ${listedIds.size} catalog templates and ${folders.length - listedIds.size} starter folders.`);

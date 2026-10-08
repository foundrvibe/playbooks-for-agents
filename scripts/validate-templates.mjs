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

function loadDiagrams() {
  const dir = join(root, "diagrams");
  const diagrams = new Map();
  const allowed = new Set(["flowchart TD", "flowchart LR", "sequenceDiagram", "erDiagram", "stateDiagram-v2"]);
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const spec = readJson(join(dir, file));
    const expectedId = file.slice(0, -".json".length);
    if (spec.id !== expectedId) fail(`diagrams/${file}: id "${spec.id}" does not match the file name`);
    if (!allowed.has(spec.mermaid)) fail(`diagrams/${file}: mermaid type "${spec.mermaid}" is not supported`);
    if (!Array.isArray(spec.inputs) || spec.inputs.length === 0) fail(`diagrams/${file}: missing inputs`);
    if (!Array.isArray(spec.rules) || spec.rules.length === 0) fail(`diagrams/${file}: missing rules`);
    diagrams.set(spec.id, spec);
  }
  return diagrams;
}

function checkPlaceholders(template, schema, charts, diagrams, label) {
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

    if (raw.startsWith("diagram:")) {
      const slot = raw.slice("diagram:".length).trim();
      const prop = props[slot];
      if (!prop) fail(`${label}: {{diagram:${slot}}} has no schema field`);
      else if (!diagrams.has(prop["x-diagram"])) fail(`${label}: {{diagram:${slot}}} has no diagram spec`);
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

function checkFolder(id, charts, folder) {
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

  checkPlaceholders(template, schema, charts, diagrams, id);
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
const diagrams = loadDiagrams();
const theme = loadTheme();
for (const key of ["colors", "fonts", "page", "chart", "numbers"]) {
  if (!theme[key]) fail(`themes/default.json: missing ${key}`);
}
const catalog = readJson(join(root, "catalog.json"));
const templateRoot = join(root, "templates");
const discovered = [];
for (const name of readdirSync(templateRoot).filter((entry) => statSync(join(templateRoot, entry)).isDirectory())) {
  const folder = join(templateRoot, name);
  if (name.startsWith("_")) {
    discovered.push({ id: name, category: null, folder });
    continue;
  }
  const children = readdirSync(folder).filter((entry) => statSync(join(folder, entry)).isDirectory());
  if (children.length === 0) fail(`templates/${name} has no templates`);
  for (const child of children) discovered.push({ id: child, category: name, folder: join(folder, child) });
}
const listedIds = new Set();
const intentOwners = new Map();

if (!Array.isArray(catalog.categories) || catalog.categories.length === 0) {
  fail("catalog.json: categories must be a non-empty array");
}
if (!Array.isArray(catalog.templates)) fail("catalog.json: templates must be an array");

const categoryIds = new Map();
for (const category of catalog.categories ?? []) {
  if (!kebabCase.test(category.id ?? "")) fail(`catalog.json: category id "${category.id}" is not lowercase kebab-case`);
  if (!category.name || !category.description) fail(`catalog.json: category ${category.id} needs a name and a description`);
  if (!Array.isArray(category.templates)) fail(`catalog.json: category ${category.id} templates must be an array`);
  if (categoryIds.has(category.id)) fail(`catalog.json: duplicate category ${category.id}`);
  categoryIds.set(category.id, new Set(category.templates));
}

for (const entry of catalog.templates ?? []) {
  const id = entry.id;
  listedIds.add(id);

  if (!kebabCase.test(id ?? "")) fail(`catalog.json: id "${id}" is not lowercase kebab-case`);
  if (entry.status !== "ready" && entry.status !== "stub") fail(`catalog.json: ${id} status must be "ready" or "stub"`);
  if (!semver.test(entry.version ?? "")) fail(`catalog.json: ${id} version must be semver`);
  const members = categoryIds.get(entry.category);
  if (!members) fail(`catalog.json: ${id} category "${entry.category}" is not defined`);
  if (!members.has(id)) fail(`catalog.json: category ${entry.category} does not list ${id}`);

  for (const [key, file] of Object.entries(catalogFileKeys)) {
    const listed = entry.files?.[key];
    const path = `templates/${entry.category}/${id}/${file}`;
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

  const found = discovered.find((item) => item.id === id && item.category === entry.category);
  if (!found) {
    fail(`catalog.json: ${id} has no templates/${entry.category}/${id} folder`);
    continue;
  }

  const schema = checkFolder(id, charts, found.folder);
  if (schema && schema["x-version"] !== entry.version) fail(`${id}: schema x-version does not match catalog version`);
}

for (const [categoryId, members] of categoryIds) {
  for (const member of members) {
    if (!listedIds.has(member)) fail(`catalog.json: category ${categoryId} lists unknown template ${member}`);
  }
}

for (const item of discovered) {
  if (item.category === null) {
    if (listedIds.has(item.id)) fail(`catalog.json: ${item.id} is a starter and must not be listed`);
    checkFolder(item.id, charts, item.folder);
    continue;
  }
  if (!categoryIds.has(item.category)) fail(`templates/${item.category} is not a catalog category`);
  if (!listedIds.has(item.id)) fail(`templates/${item.category}/${item.id} is missing from catalog.json`);
}

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}

const starters = discovered.filter((item) => item.category === null).length;
console.log(`Validated ${listedIds.size} catalog templates and ${starters} starter folders.`);

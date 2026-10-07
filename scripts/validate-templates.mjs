import Ajv from "ajv/dist/2020.js";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rawBase = "https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/";
const errors = [];
const ajv = new Ajv({ allErrors: true, strict: false });

const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const tokenPattern = /\{\{\s*([^}]+?)\s*\}\}/g;

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function fail(message) {
  errors.push(message);
}

function isBlank(value) {
  if (value === null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object" && value !== null) return Object.keys(value).length === 0;
  return false;
}

function loadCharts() {
  const dir = join(root, "charts");
  const charts = new Map();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const spec = readJson(join(dir, file));
    const expectedId = file.slice(0, -".json".length);
    if (spec.id !== expectedId) {
      fail(`charts/${file}: id "${spec.id}" does not match the file name`);
    }
    if (spec.render !== "markdown-table" && spec.render !== "mermaid-xy") {
      fail(`charts/${file}: render must be "markdown-table" or "mermaid-xy"`);
    }
    if (!spec.data) {
      fail(`charts/${file}: missing data shape`);
    }
    charts.set(spec.id, spec);
  }
  return charts;
}

function propertiesOf(schema) {
  return schema && schema.properties ? schema.properties : {};
}

function itemSchema(prop) {
  if (!prop || !prop.items || Array.isArray(prop.items)) return null;
  return prop.items;
}

function checkPlaceholders(template, schema, charts, label) {
  const stack = [schema];
  for (const match of template.matchAll(tokenPattern)) {
    const raw = match[1].trim();
    const current = stack[stack.length - 1];
    const props = propertiesOf(current);

    if (raw === "/each") {
      if (stack.length === 1) fail(`${label}: unexpected {{/each}}`);
      else stack.pop();
      continue;
    }

    if (raw.startsWith("#each ")) {
      const name = raw.slice("#each ".length).trim();
      const prop = props[name];
      if (!prop) {
        fail(`${label}: {{#each ${name}}} has no schema field`);
        stack.push({ properties: {} });
        continue;
      }
      const items = itemSchema(prop);
      if (!items || !items.properties) {
        fail(`${label}: {{#each ${name}}} is not an array of objects`);
        stack.push({ properties: {} });
        continue;
      }
      stack.push(items);
      continue;
    }

    if (raw.startsWith("chart:")) {
      const slot = raw.slice("chart:".length).trim();
      const prop = props[slot];
      if (!prop) {
        fail(`${label}: {{chart:${slot}}} has no schema field`);
        continue;
      }
      const chartId = prop["x-chart"];
      if (!chartId || !charts.has(chartId)) {
        fail(`${label}: {{chart:${slot}}} has no chart spec`);
      }
      continue;
    }

    if (!props[raw]) {
      fail(`${label}: {{${raw}}} has no schema field`);
    }
  }

  if (stack.length !== 1) fail(`${label}: unclosed {{#each}}`);
}

function checkExampleBlank(example, schema, label) {
  const required = new Set(schema.required || []);
  const optionalKeys = Object.keys(schema.properties || {}).filter((key) => !required.has(key));
  const hasBlank = optionalKeys.some((key) => isBlank(example[key]));
  if (!hasBlank) {
    fail(`${label}: example has no null or empty optional field`);
  }
}

function validateExample(schema, example, label) {
  const validate = ajv.compile(schema);
  if (validate(example)) return;
  for (const issue of validate.errors || []) {
    fail(`${label}: ${issue.instancePath || "/"} ${issue.message}`);
  }
}

const charts = loadCharts();
const catalog = readJson(join(root, "catalog.json"));
const templateRoot = join(root, "templates");
const folders = readdirSync(templateRoot).filter((name) => statSync(join(templateRoot, name)).isDirectory());
const listedIds = new Set();

if (!Array.isArray(catalog.templates)) {
  fail("catalog.json: templates must be an array");
}

for (const entry of catalog.templates || []) {
  const id = entry.id;
  listedIds.add(id);

  if (!kebabCase.test(id || "")) {
    fail(`catalog.json: id "${id}" is not lowercase kebab-case`);
  }
  if (entry.status !== "ready" && entry.status !== "stub") {
    fail(`catalog.json: ${id} status must be "ready" or "stub"`);
  }

  const folder = join(templateRoot, id);
  const requiredFiles = ["template.md", "schema.json", "example.json"];
  for (const file of requiredFiles) {
    const path = join(folder, file);
    try {
      statSync(path);
    } catch {
      fail(`${id}: missing ${file}`);
    }
  }

  const files = entry.files || {};
  for (const key of ["template", "schema", "example"]) {
    const file = files[key];
    if (!file?.path || !file?.url) {
      fail(`catalog.json: ${id} is missing files.${key}`);
      continue;
    }
    const absolute = join(root, file.path);
    try {
      statSync(absolute);
    } catch {
      fail(`catalog.json: ${id} path does not exist: ${file.path}`);
    }
    if (file.url !== rawBase + file.path) {
      fail(`catalog.json: ${id} ${key} url does not match ${rawBase}${file.path}`);
    }
  }

  if (entry.status === "stub") {
    for (const file of requiredFiles) {
      try {
        statSync(join(folder, file));
      } catch {
        fail(`stub ${id}: missing ${file}`);
      }
    }
  }

  let schema;
  let example;
  let template;
  try {
    schema = readJson(join(folder, "schema.json"));
    example = readJson(join(folder, "example.json"));
    template = readFileSync(join(folder, "template.md"), "utf8");
  } catch (error) {
    fail(`${id}: ${error.message}`);
    continue;
  }

  if (schema["x-id"] !== id) fail(`${id}: schema x-id does not match catalog id`);
  if (schema["x-version"] !== entry.version) fail(`${id}: schema x-version does not match catalog version`);

  validateExample(schema, example, id);
  checkPlaceholders(template, schema, charts, id);
  if (entry.status === "ready") checkExampleBlank(example, schema, id);
}

for (const folder of folders) {
  if (!listedIds.has(folder)) fail(`templates/${folder} is missing from catalog.json`);
  const names = readdirSync(join(templateRoot, folder));
  const expected = ["example.json", "schema.json", "template.md"];
  const extras = names.filter((name) => !expected.includes(name));
  const missing = expected.filter((name) => !names.includes(name));
  for (const name of missing) fail(`templates/${folder}: missing ${name}`);
  for (const name of extras) fail(`templates/${folder}: unexpected file ${name}`);
}

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log(`Validated ${listedIds.size} templates.`);

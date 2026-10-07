import Ajv from "ajv/dist/2020.js";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const sourceTypes = ["user", "user_data", "research", "derived"];

const defaultUnknown = "_Unknown — not provided_";
const baseMarkers = ["Unknown — not provided", "No data provided"];
const tokenPattern = /\{\{\s*([^}]+?)\s*\}\}/g;
const eachPattern = /\{\{#each\s+(\w+)\s*\}\}\n?([\s\S]*?)\{\{\/each\}\}\n?/g;
const listMarker = /^\s*\d+\.\s/gm;
const numberPattern = /\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/g;

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function loadTemplate(id) {
  const folder = join(root, "templates", id);
  return {
    folder,
    template: readFileSync(join(folder, "template.md"), "utf8"),
    schema: readJson(join(folder, "schema.json")),
  };
}

export function loadChart(chartId) {
  return readJson(join(root, "charts", `${chartId}.json`));
}

function unknownText(prop) {
  return prop?.["x-unknown"] ?? defaultUnknown;
}

function formatValue(value, prop) {
  if (value === null || value === undefined || value === "") return unknownText(prop);
  return String(value);
}

function markdownTable(rows, labelHeader, valueHeader) {
  const lines = [`| ${labelHeader} | ${valueHeader} |`, "|---|---|"];
  for (const [label, value] of rows) lines.push(`| ${label} | ${value} |`);
  return lines.join("\n");
}

function renderChart(prop, value) {
  if (!prop || value === null || value === undefined) return unknownText(prop);
  const spec = loadChart(prop["x-chart"]);

  if (spec.render === "markdown-table") {
    return markdownTable(value.map((row) => [row.label, row.value]), "Label", "Value");
  }

  if (spec.render === "mermaid-xy") {
    const name = value.seriesName ?? "Value";
    const unsafe = [...value.x, name].some((label) => /["[\]\n]/.test(label));
    if (unsafe) {
      return markdownTable(value.x.map((label, index) => [label, value.series[index]]), "Period", name);
    }
    const min = Math.min(...value.series);
    const max = Math.max(...value.series);
    return [
      "```mermaid",
      "xychart-beta",
      `  title "${name}"`,
      `  x-axis [${value.x.map((label) => `"${label}"`).join(", ")}]`,
      `  y-axis "${name}" ${min} --> ${max}`,
      `  bar [${value.series.join(", ")}]`,
      "```",
      "",
      "The y-axis range is derived from the lowest and highest values in the series.",
    ].join("\n");
  }

  throw new Error(`Unsupported chart render "${spec.render}"`);
}

function fillTokens(text, schema, values) {
  const props = schema?.properties ?? {};
  return text.replace(tokenPattern, (match, raw) => {
    const key = raw.trim();
    if (key.startsWith("chart:")) {
      const slot = key.slice("chart:".length).trim();
      return renderChart(props[slot], values[slot]);
    }
    if (!(key in props)) return match;
    return formatValue(values[key], props[key]);
  });
}

export function renderFill(template, schema, fill) {
  const props = schema.properties ?? {};
  const withLoops = template.replace(eachPattern, (_, name, body) => {
    const items = fill[name];
    if (items === null || items === undefined) return `${unknownText(props[name])}\n`;
    return items.map((item) => fillTokens(body, props[name]?.items, item)).join("");
  });
  return fillTokens(withLoops, schema, fill);
}

function numbersIn(text, found = new Set()) {
  for (const match of text.replace(listMarker, "").matchAll(numberPattern)) {
    found.add(String(Number(match[0].replace(/,/g, ""))));
  }
  return found;
}

function numbersInValue(value, found = new Set()) {
  if (typeof value === "number") found.add(String(value));
  else if (typeof value === "string") numbersIn(value, found);
  else if (Array.isArray(value)) for (const item of value) numbersInValue(item, found);
  else if (value && typeof value === "object") for (const item of Object.values(value)) numbersInValue(item, found);
  return found;
}

function matchesExpected(actual, expected) {
  if (typeof expected === "string") {
    return typeof actual === "string" && actual.toLowerCase().includes(expected.toLowerCase());
  }
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function checkFill({ schema, fill, markdown, expect }) {
  const errors = [];
  const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);
  if (!validate(fill)) {
    for (const issue of validate.errors ?? []) errors.push(`fill ${issue.instancePath || "/"} ${issue.message}`);
  }

  const markers = new Set(baseMarkers);
  for (const prop of Object.values(schema.properties ?? {})) {
    if (prop["x-unknown"]) markers.add(prop["x-unknown"].replace(/^_|_$/g, ""));
  }
  for (const marker of markers) {
    if (markdown.includes(marker)) errors.push(`markdown still contains "${marker}"`);
  }
  if (/\{\{[^}]*\}\}/.test(markdown)) errors.push("markdown has an unfilled {{placeholder}}");

  const known = numbersInValue(fill);
  for (const number of numbersIn(markdown)) {
    if (!known.has(number)) errors.push(`markdown number ${number} is not in the fill JSON`);
  }

  for (const [field, expected] of Object.entries(expect ?? {})) {
    if (!matchesExpected(fill[field], expected)) {
      errors.push(`expected ${field} to match ${JSON.stringify(expected)}, got ${JSON.stringify(fill[field])}`);
    }
  }

  return errors;
}

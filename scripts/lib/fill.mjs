import Ajv from "ajv/dist/2020.js";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const sourceTypes = ["user", "user_data", "research", "derived"];
export const formatTypes = ["currency", "number"];

const defaultUnknown = "_Unknown — not provided_";
const baseMarkers = ["Unknown — not provided", "No data provided"];
const tokenPattern = /\{\{\s*([^}]+?)\s*\}\}/g;
const eachPattern = /\{\{#each\s+(\w+)\s*\}\}\n?([\s\S]*?)\{\{\/each\}\}\n?/g;
const listMarker = /^\s*\d+\.\s/gm;
const mermaidConfig = /(```mermaid\n)---\n[\s\S]*?\n---\n/g;
const numberPattern = /\d{1,3}(?:[,\u00A0\u202F ]\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/g;
const groupSeparators = /[,\u00A0\u202F ]/g;

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function templateFolder(id) {
  const templateRoot = join(root, "playbooks");
  if (id.startsWith("_") && existsSync(join(templateRoot, id, "schema.json"))) return join(templateRoot, id);
  for (const category of readdirSync(templateRoot)) {
    if (!statSync(join(templateRoot, category)).isDirectory() || category.startsWith("_")) continue;
    const folder = join(templateRoot, category, id);
    if (existsSync(join(folder, "schema.json"))) return folder;
  }
  throw new Error(`No template folder for ${id}`);
}

export function loadTemplate(id) {
  const folder = templateFolder(id);
  return {
    folder,
    template: readFileSync(join(folder, "template.md"), "utf8"),
    schema: readJson(join(folder, "schema.json")),
  };
}

export function loadChart(chartId) {
  return readJson(join(root, "charts", `${chartId}.json`));
}

export function loadDiagram(diagramId) {
  return readJson(join(root, "diagrams", `${diagramId}.json`));
}

export function loadTheme(name = "default") {
  return readJson(join(root, "themes", `${name}.json`));
}

export function numberFormats(fill, theme) {
  const language = theme.numbers.languages[fill.document_language] ?? "en";
  const country = theme.numbers.countries[fill.market_country];
  const locale = country ? `${language}-${country.code}` : language;
  const currency = country?.currency ?? null;
  const plain = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const money = currency
    ? new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 2 })
    : plain;
  return {
    locale,
    currency,
    format(value, kind) {
      return kind === "currency" ? money.format(value) : plain.format(value);
    },
  };
}

function unknownText(prop) {
  return prop?.["x-unknown"] ?? defaultUnknown;
}

function formatValue(value, prop, formats) {
  if (value === null || value === undefined || value === "") return unknownText(prop);
  if (typeof value === "number" && formatTypes.includes(prop?.["x-format"])) {
    return formats.format(value, prop["x-format"]);
  }
  return String(value);
}

function markdownTable(rows, labelHeader, valueHeader) {
  const lines = [`| ${labelHeader} | ${valueHeader} |`, "|---|---:|"];
  for (const [label, value] of rows) lines.push(`| ${label} | ${value} |`);
  return lines.join("\n");
}

export function mermaidConfigBlock(theme) {
  const { colors, chart } = theme;
  return [
    "---",
    "config:",
    "  theme: base",
    "  xyChart:",
    `    width: ${chart.width}`,
    `    height: ${chart.height}`,
    "  themeVariables:",
    `    fontFamily: '${theme.fonts.body.replace(/'/g, "")}'`,
    "    xyChart:",
    `      backgroundColor: "${colors.background}"`,
    `      titleColor: "${colors.text}"`,
    `      xAxisLabelColor: "${colors.muted}"`,
    `      xAxisLineColor: "${colors.border}"`,
    `      yAxisLabelColor: "${colors.muted}"`,
    `      yAxisTitleColor: "${colors.muted}"`,
    `      yAxisLineColor: "${colors.border}"`,
    `      plotColorPalette: "${colors.series.join(", ")}"`,
    "---",
  ].join("\n");
}

function renderChart(prop, value, theme, formats) {
  if (!prop || value === null || value === undefined) return unknownText(prop);
  const spec = loadChart(prop["x-chart"]);
  const kind = prop["x-format"] ?? "number";
  const show = (number) => formats.format(number, kind);

  if (spec.render === "markdown-table") {
    return markdownTable(value.map((row) => [row.label, show(row.value)]), "Label", "Value");
  }

  if (spec.render === "mermaid-xy") {
    const name = value.seriesName ?? "Value";
    const axisTitle = kind === "currency" && formats.currency ? `${name} (${formats.currency})` : name;
    const unsafe = [...value.x, name].some((label) => /["[\]\n]/.test(label));
    if (unsafe) {
      return markdownTable(value.x.map((label, index) => [label, show(value.series[index])]), "Period", name);
    }
    const min = Math.min(...value.series);
    const max = Math.max(...value.series);
    return [
      "```mermaid",
      mermaidConfigBlock(theme),
      "xychart-beta",
      `  title "${name}"`,
      `  x-axis [${value.x.map((label) => `"${label}"`).join(", ")}]`,
      `  y-axis "${axisTitle}" ${min} --> ${max}`,
      `  bar [${value.series.join(", ")}]`,
      "```",
      "",
      markdownTable(value.x.map((label, index) => [label, show(value.series[index])]), "Period", name),
      "",
      "The y-axis range is derived from the lowest and highest values in the series.",
    ].join("\n");
  }

  throw new Error(`Unsupported chart render "${spec.render}"`);
}

function fillTokens(text, schema, values, theme, formats) {
  const props = schema?.properties ?? {};
  return text.replace(tokenPattern, (match, raw) => {
    const key = raw.trim();
    if (key.startsWith("chart:")) {
      const slot = key.slice("chart:".length).trim();
      return renderChart(props[slot], values[slot], theme, formats);
    }
    if (key.startsWith("diagram:")) {
      const slot = key.slice("diagram:".length).trim();
      const source = values[slot];
      if (typeof source !== "string" || source.trim() === "") return unknownText(props[slot]);
      return ["```mermaid", source.trim(), "```"].join("\n");
    }
    if (!(key in props)) return match;
    return formatValue(values[key], props[key], formats);
  });
}

export function renderFill(template, schema, fill, theme = loadTheme()) {
  const formats = numberFormats(fill, theme);
  const props = schema.properties ?? {};
  const withLoops = template.replace(eachPattern, (_, name, body) => {
    const items = fill[name];
    if (items === null || items === undefined) return `${unknownText(props[name])}\n`;
    return items.map((item) => fillTokens(body, props[name]?.items, item, theme, formats)).join("");
  });
  return fillTokens(withLoops, schema, fill, theme, formats);
}

function numbersIn(text, found = new Set()) {
  for (const match of text.replace(listMarker, "").matchAll(numberPattern)) {
    found.add(String(Number(match[0].replace(groupSeparators, ""))));
  }
  return found;
}

function collectNumbers(value, numbers = [], found = new Set()) {
  if (typeof value === "number") {
    numbers.push(value);
    found.add(String(value));
  } else if (typeof value === "string") numbersIn(value, found);
  else if (Array.isArray(value)) for (const item of value) collectNumbers(item, numbers, found);
  else if (value && typeof value === "object") for (const item of Object.values(value)) collectNumbers(item, numbers, found);
  return { numbers, found };
}

function withoutFormattedNumbers(markdown, numbers, formats) {
  const formatted = new Set();
  for (const number of numbers) {
    for (const kind of formatTypes) formatted.add(formats.format(number, kind));
  }
  let text = markdown;
  for (const value of [...formatted].sort((a, b) => b.length - a.length)) {
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`(?<!\\d|\\d[.,])${escaped}(?!\\d|[.,]\\d)`, "g"), " ");
  }
  return text;
}

function matchesExpected(actual, expected) {
  if (typeof expected === "string") {
    return typeof actual === "string" && actual.toLowerCase().includes(expected.toLowerCase());
  }
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function checkFill({ schema, fill, markdown, expect, theme = loadTheme() }) {
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

  for (const [name, prop] of Object.entries(schema.properties ?? {})) {
    if (!prop["x-diagram"] || typeof fill[name] !== "string") continue;
    const spec = loadDiagram(prop["x-diagram"]);
    const source = fill[name].trim();
    const header = source.split("\n")[0].trim();
    if (header.split(/\s+/)[0] !== spec.mermaid.split(/\s+/)[0]) {
      errors.push(`${name} must start with "${spec.mermaid}", got "${header}"`);
    }
    if (source.includes("```")) errors.push(`${name} must be Mermaid source without code fences`);
  }

  const { numbers, found } = collectNumbers(fill);
  const prose = withoutFormattedNumbers(markdown.replace(mermaidConfig, "$1"), numbers, numberFormats(fill, theme));
  for (const number of numbersIn(prose)) {
    if (!found.has(number)) errors.push(`markdown number ${number} is not in the fill JSON`);
  }

  for (const [field, expected] of Object.entries(expect ?? {})) {
    if (!matchesExpected(fill[field], expected)) {
      errors.push(`expected ${field} to match ${JSON.stringify(expected)}, got ${JSON.stringify(fill[field])}`);
    }
  }

  return errors;
}

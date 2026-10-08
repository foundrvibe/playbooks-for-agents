# Templates

Fillable document templates for AI agents. Each template is Markdown plus a JSON Schema and an example fill. One fill skill covers every template. The user supplies context. The agent researches the other sections, cites sources, and does not leave a section unknown.

The fill contract is [rules/fill.md](rules/fill.md). The procedure is [skills/fill-template/SKILL.md](skills/fill-template/SKILL.md). The index is [catalog.json](catalog.json).

The catalog groups templates into categories. The first category is **Planning**, and it contains the business plan. Intent matching uses ready templates and skips stubs.

## Use it

Paste this into ChatGPT, Claude, or a Cursor agent chat. One link is enough. The skill fetches the rules, the catalog, and the template files.

```text
Follow https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/skills/fill-template/SKILL.md

Create a business plan for ZedCut, a bilingual B2B SaaS for countertop fabrication shops in Canada.
```

Replace the second line with your own request. If several templates match, the agent asks which one and names the category.

To choose the template yourself, name its id. The agent uses that template and does not match intents.

```text
Follow https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/skills/fill-template/SKILL.md

Template: business-plan
ZedCut is a bilingual B2B SaaS for countertop fabrication shops in Canada.
```

A raw URL to `template.md`, `schema.json`, or the template folder selects it the same way. Replace `dev` with a version tag to pin that template.

## Add a template

1. Copy `templates/_starter/` to `templates/<category>/<id>/`. Set `x-id` in `schema.json` to the new id.
2. Edit `template.md`, `schema.json`, and `example.json`. Mark each field `x-source` as `user`, `user_data`, `derived`, or `research`.
3. In `research.md`, name every `research` field and link the shared guide as `../../../research/<name>.md`. Add a new shared guide only when none fits.
4. Add a catalog entry with `id`, `name`, `version`, `status`, `category`, `description`, `intents`, and the four file paths. `category` must be an id in `categories`, and that category's `templates` list must include the new id. Create a category when none fits. Set `status` to `ready` and fill `intents` when a request should select it. Leave `intents` empty while it is a stub.
5. Run `npm ci && npm run validate`.

No new skill is required. CI fails if two ready templates share an intent, if `research.md` misses a research field, or if the example does not pass the fill check.

## Pin a version

Each template version is tagged as `<id>-v<version>`, for example `business-plan-v3.0.0`. Replace `dev` in any raw URL with the tag to keep a fixed shape:

`https://raw.githubusercontent.com/foundrvibe/templates-for-agents/business-plan-v3.0.0/templates/planning/business-plan/template.md`

A tag pins the rules and skill at that commit too. A breaking schema change gets a new major version.

## Check a fill

Save the JSON the agent returns, and optionally its Markdown, then run:

```text
npm ci
node scripts/check-fill.mjs business-plan fill.json filled.md
```

It fails when the JSON does not match the schema, the Markdown still has an unknown marker or a placeholder, `sources` is empty in `web` mode, or a number in the Markdown is not in the JSON. Without `filled.md`, it renders the JSON with `scripts/render-fill.mjs` first.

## Test contexts

[tests/contexts/](tests/contexts/) holds real contexts, such as `zedcut.json`. Paste its `context` into each agent, save the fill, and add `--expect tests/contexts/zedcut.json` to the check to compare the fields it lists.

## What comes back

The agent returns the filled Markdown and a JSON object of the field values. Sources are listed in the document.

## Charts

Charts come from cited figures or from a labeled assumption built from them.

- **Agents that can run Python** (ChatGPT data analysis, Claude code execution, Cursor) draw each chart with [charts/render_chart.py](charts/render_chart.py) and show the PNG, with the same values in a table below it. The colors and size come from [themes/default.json](themes/default.json), so every plan looks the same.
- **Agents that can't run Python** write a Mermaid chart and a table instead.

To draw one yourself:

```text
pip install matplotlib
python charts/render_chart.py --kind mermaid-xy --data '{"seriesName": "Revenue", "x": ["Year 1", "Year 2"], "series": [120000, 260000]}' --currency CAD --language fr --out financials.png
```

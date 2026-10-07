# Templates

Fillable document templates for AI agents. Each template is Markdown plus a JSON Schema and an example fill. One fill skill covers every template. The user supplies context. The agent researches the other sections, cites sources, and does not leave a section unknown.

The fill contract is [rules/fill.md](rules/fill.md). The procedure is [skills/fill-template/SKILL.md](skills/fill-template/SKILL.md). The index is [catalog.json](catalog.json).

Read the catalog at use time. It is the list of templates, including ones added later. Intent matching uses entries whose `status` is `ready` and skips `stub`. Do not assume a fixed set of ids.

Raw files use this base URL:

`https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/`

Paste any prompt below into ChatGPT, Claude, or a Cursor agent chat. Replace `<id>` with an id from the catalog.

## Add a template

1. Copy `templates/_starter/` to `templates/<id>/`. Set `x-id` in `schema.json` to the new id.
2. Edit `template.md`, `schema.json`, and `example.json`. Mark each field `x-source` as `user`, `user_data`, `derived`, or `research`.
3. In `research.md`, name every `research` field and link the shared guide in [research/](research/) it uses. Add a new shared guide only when none fits.
4. Add a catalog entry with `id`, `name`, `version`, `status`, `category`, `description`, `intents`, and the four file paths. Set `status` to `ready` and fill `intents` when a request should select it. Leave `intents` empty while it is a stub.
5. Run `npm ci && npm run validate`.

No new skill is required. CI fails if two ready templates share an intent, if `research.md` misses a research field, or if the example does not pass the fill check.

## Pin a version

Each template version is tagged as `<id>-v<version>`, for example `business-plan-v3.0.0`. Replace `dev` in any raw URL with the tag to keep a fixed shape:

`https://raw.githubusercontent.com/foundrvibe/templates-for-agents/business-plan-v3.0.0/templates/business-plan/template.md`

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

## By URL

The agent fetches the template files directly.

**ChatGPT**

```text
Follow https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/rules/fill.md

Load this template by URL and also fetch schema.json, example.json, and research.md from the same folder:
https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/templates/<id>/template.md

I will give you the context only. Research every other section, cite sources, and do not leave a section unknown. Do not invent people's names. If you cannot browse the web, say so first and do not cite pages you did not open.
```

**Claude**

```text
Follow https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/rules/fill.md

Load this template by URL and also fetch schema.json, example.json, and research.md from the same folder:
https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/templates/<id>/template.md

I will give you the context only. Research every other section, cite sources, and do not leave a section unknown. Do not invent people's names. If you cannot browse the web, say so first and do not cite pages you did not open.
```

**Cursor**

```text
Follow skills/fill-template/SKILL.md and rules/fill.md in this repo. If you cannot read the repo, fetch https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/rules/fill.md

Load templates/<id>/template.md plus its schema.json, example.json, and research.md.

I will give you the context only. Research every other section, cite sources, and do not leave a section unknown. Do not invent people's names. If you cannot browse the web, say so first and do not cite pages you did not open.
```

## By id

The agent resolves the id through the catalog.

**ChatGPT**

```text
Read https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/catalog.json
Follow https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/rules/fill.md

Load template id "<id>".
I will give you the context only. Research every other section, cite sources, and do not leave a section unknown. Do not invent people's names. If you cannot browse the web, say so first and do not cite pages you did not open.
```

**Claude**

```text
Read https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/catalog.json
Follow https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/rules/fill.md

Load template id "<id>".
I will give you the context only. Research every other section, cite sources, and do not leave a section unknown. Do not invent people's names. If you cannot browse the web, say so first and do not cite pages you did not open.
```

**Cursor**

```text
Read catalog.json and follow skills/fill-template/SKILL.md and rules/fill.md. If you cannot read the repo, use the raw files under https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/

Load template id "<id>".
I will give you the context only. Research every other section, cite sources, and do not leave a section unknown. Do not invent people's names. If you cannot browse the web, say so first and do not cite pages you did not open.
```

## By intent

The agent matches the request to `intents` on ready templates in the catalog. If more than one ready template matches, it asks which one. Stubs are skipped. Templates added later are included if they are `ready` and list intents.

**ChatGPT**

```text
Read https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/catalog.json
Follow https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/rules/fill.md

Match this request to one ready template intent in the catalog. If several match, ask me which template to use.

Request: <what you want written>
```

**Claude**

```text
Read https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/catalog.json
Follow https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/rules/fill.md

Match this request to one ready template intent in the catalog. If several match, ask me which template to use.

Request: <what you want written>
```

**Cursor**

```text
Read catalog.json and follow skills/fill-template/SKILL.md and rules/fill.md. If you cannot read the repo, use the raw files under https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/

Match this request to one ready template intent in the catalog. If several match, ask me which template to use.

Request: <what you want written>
```

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

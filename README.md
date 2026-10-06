# FoundrVibe Templates

Fillable document templates for AI agents. Each template is Markdown plus a JSON Schema and an example fill. One fill skill covers every template: required gaps get asked, unknown optional fields stay blank, and numbers are never invented.

The fill contract is [rules/fill.md](rules/fill.md). The procedure is [skills/fill-template/SKILL.md](skills/fill-template/SKILL.md). The index is [catalog.json](catalog.json).

Ready templates: `prd`, `business-plan`. `letter` and `weekly-report` are stubs and are not chosen by intent.

Raw files use this base URL:

`https://raw.githubusercontent.com/foundrvibe/templates/main/`

Paste any prompt below into ChatGPT, Claude, or a Cursor agent chat.

## By URL

The agent fetches the template files directly.

**ChatGPT**

```text
Follow https://raw.githubusercontent.com/foundrvibe/templates/main/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates/main/rules/fill.md

Load this template by URL and also fetch schema.json and example.json from the same folder:
https://raw.githubusercontent.com/foundrvibe/templates/main/templates/prd/template.md

Write a PRD from facts I give you. Ask for every required field you do not have. Do not invent numbers, dates, or names.
```

**Claude**

```text
Follow https://raw.githubusercontent.com/foundrvibe/templates/main/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates/main/rules/fill.md

Load this template by URL and also fetch schema.json and example.json from the same folder:
https://raw.githubusercontent.com/foundrvibe/templates/main/templates/prd/template.md

Write a PRD from facts I give you. Ask for every required field you do not have. Do not invent numbers, dates, or names.
```

**Cursor**

```text
Follow skills/fill-template/SKILL.md and rules/fill.md in this repo. If you cannot read the repo, fetch https://raw.githubusercontent.com/foundrvibe/templates/main/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates/main/rules/fill.md

Load templates/prd/template.md plus its schema.json and example.json.

Write a PRD from facts I give you. Ask for every required field you do not have. Do not invent numbers, dates, or names.
```

## By id

The agent resolves the id through the catalog.

**ChatGPT**

```text
Read https://raw.githubusercontent.com/foundrvibe/templates/main/catalog.json
Follow https://raw.githubusercontent.com/foundrvibe/templates/main/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates/main/rules/fill.md

Load template id "business-plan".
Write the plan from facts I give you. Ask for every required field you do not have. Do not invent numbers, dates, or names.
```

**Claude**

```text
Read https://raw.githubusercontent.com/foundrvibe/templates/main/catalog.json
Follow https://raw.githubusercontent.com/foundrvibe/templates/main/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates/main/rules/fill.md

Load template id "business-plan".
Write the plan from facts I give you. Ask for every required field you do not have. Do not invent numbers, dates, or names.
```

**Cursor**

```text
Read catalog.json and follow skills/fill-template/SKILL.md and rules/fill.md. If you cannot read the repo, use the raw files under https://raw.githubusercontent.com/foundrvibe/templates/main/

Load template id "business-plan".
Write the plan from facts I give you. Ask for every required field you do not have. Do not invent numbers, dates, or names.
```

## By intent

The agent matches the request to `intents` on ready templates. If more than one ready template matches, it asks which one. Stubs are skipped.

**ChatGPT**

```text
Read https://raw.githubusercontent.com/foundrvibe/templates/main/catalog.json
Follow https://raw.githubusercontent.com/foundrvibe/templates/main/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates/main/rules/fill.md

Match this request to one ready template intent. If several match, ask me which template to use.

Request: write a PRD for a shared client inbox for freelance studios.
```

**Claude**

```text
Read https://raw.githubusercontent.com/foundrvibe/templates/main/catalog.json
Follow https://raw.githubusercontent.com/foundrvibe/templates/main/skills/fill-template/SKILL.md and https://raw.githubusercontent.com/foundrvibe/templates/main/rules/fill.md

Match this request to one ready template intent. If several match, ask me which template to use.

Request: write a PRD for a shared client inbox for freelance studios.
```

**Cursor**

```text
Read catalog.json and follow skills/fill-template/SKILL.md and rules/fill.md. If you cannot read the repo, use the raw files under https://raw.githubusercontent.com/foundrvibe/templates/main/

Match this request to one ready template intent. If several match, ask me which template to use.

Request: write a PRD for a shared client inbox for freelance studios.
```

## What comes back

The agent returns the filled Markdown and a JSON object of the field values. Chart slots become a Markdown table or a Mermaid `xychart-beta` only when the matching numbers were provided. Otherwise the slot says `No data provided`.

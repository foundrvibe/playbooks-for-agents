---
name: fill-template
description: >-
  Runs a playbook from the user's context plus public research. Use when the
  user asks to run a playbook, gives a playbook URL or id, or describes work
  that should match an intent in catalog.json. The catalog is the list of
  playbooks, including any added later.
---

# Run a playbook

A playbook is a manual process. The user supplies context. You ask only for what you cannot find, follow that playbook's steps, and return the finished result. The shape stays fixed. Do not leave a section unknown.

This file is the only link a user needs to send. Fetch the other files yourself. Do not ask the user for more links.

Base URL: `https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/`

| File | URL |
|---|---|
| Fill rules | `https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/rules/fill.md` |
| Catalog | `https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/catalog.json` |
| Chart script | `https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/charts/render_chart.py` |
| Chart specs | `https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/charts/<id>.json` |
| Diagram specs | `https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/diagrams/<id>.json` |
| Shared research guides | `https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/research/<name>.md` |

Read the fill rules before you write. They are the contract. This skill runs the playbook. The playbook's own `## Steps` are the job.

Read the catalog at fill time. It lists `categories`, and each category lists playbook ids. Do not assume a fixed set. A new playbook is a catalog entry plus `template.md`, `schema.json`, `example.json`, and `research.md`. The catalog entries already contain the raw URL of each file. `template.md` is the result shape.

## 1. Resolve the playbook

Use the first case that fits.

- **URL.** The user pasted a raw URL to `template.md`, `schema.json`, or a playbook folder. Fetch `template.md`, `schema.json`, `example.json`, and `research.md` from that folder.
- **Id.** The user named a playbook with `Playbook: <id>` or `Template: <id>`, or the message contains a catalog `id`. Find that `id` in `catalog.json` and skip intent matching. Fetch the four files at `files.template`, `files.schema`, `files.example`, and `files.research`. If the id is not in the catalog, list the categories and their ready playbooks, and ask which one.
- **Intent.** Compare the user's request to `intents` on playbooks whose `status` is `ready`. Ignore `status: "stub"`. If one ready playbook matches, use it. If more than one matches, ask which one and name its category. If none match, list the categories and their ready playbooks, and ask which one.

`example.json` shows a valid shape. Do not copy its facts into the user's result.

If the chosen playbook is a stub and the user asked for it by id or URL, say that it is a stub, then continue only if they still want that shape.

## 2. Collect context

Read the conversation and any files the user attached. Map that context onto schema fields.

The first reply is only the questions that are still open. Do not send a draft in that reply.

Ask for every field whose `x-source` is `user` or `user_data` when the context does not already answer it. Use each field's `x-ask`. Put those questions in one message, then stop and wait. Skip a question the context already answers. If every such field is already answered, do not ask anything and continue to research.

Do not ask for fields whose `x-source` is `research` or `derived`. Market size, competitors, industry, channels, and operations are research.

Set `market_country` from the context when the playbook has it. Ask only if the context names no country. Set `document_language` to the language of the user's request unless they asked for another.

When the user replies, treat "I don't know", "skip", "none", or "not raising" as an answer. Continue. Do not ask those questions again. A number they did not know is a labeled assumption, not a blank and not a question in the document.

## 3. Research

Before researching, check whether you can open web pages in this session. If you cannot, tell the user in one line, set `research_mode` to `offline`, leave `sources` empty, and write every research field as an `Assumption:` built from the context. Do not write a citation for a page you did not open. If you can browse, set `research_mode` to `web`.

After you have the context, fetch the playbook's `research.md` from its catalog URL. Follow `## Steps` in order. Where a step names a field, open the shared guide linked beside that field. Fetch that guide from `https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/research/<name>.md` (the file name in the link, such as `market-size.md`). Fill every field whose `x-source` is `research` or `derived` before you write the result.

- Research for `market_country`: its statistics agency, registries, currency, and competitors that sell there.
- Put each page you opened in `sources` with its title, publisher, URL, and the date you opened it. A researched claim in the document must match one of those sources.
- Set `x-source: derived` fields only from the user's context and those sources, and say which inputs you used.
- If a figure is an estimate, start it with `Assumption:` and show the cited inputs. Do not present an estimate as the company's actual cash, revenue, or signed legal form.
- Do not invent a person's name. Use a name from the context or from a public source. Otherwise describe the role.
- Do not copy facts from `example.json`.

Do not render `_Unknown — not provided_` or `No data provided`. On a research field, `x-unknown` is a reminder to research it, not text to paste into the document.

## 4. Fill the Markdown

Use `template.md` as the only layout. Section headings come from that file. Do not add, drop, or rename them. Write the prose in `document_language`, but keep the headings as written so documents stay comparable.

- Replace `{{field}}` with the researched or derived value.
- Repeat a `{{#each collection}}` block once per item. A collection that research can fill is not left empty.
- List each assumption in the Assumptions section.
- List each source in the Sources section.
- Do not add a missing-info section, a confirmation list, or questions inside the document. Those were asked before the draft.

## 5. Charts

A `{{chart:slot_id}}` placeholder is the schema field `slot_id`. Its `x-chart` value is a spec id. Fetch `https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/charts/<id>.json`. The series must match the spec and must be cited figures or a labeled assumption built from cited figures. Say that the range is derived from those values.

**If you can run Python** (ChatGPT data analysis, Claude code execution, a Cursor terminal), draw the chart yourself. Fetch `https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/charts/render_chart.py`, run it in your Python tool with the slot's JSON value, and show the PNG:

```text
python render_chart.py --kind <x-chart> --data '<slot JSON>' --currency <currency> --language <two-letter code> --out <slot_id>.png
```

Use the currency of `market_country` when the field has `x-format: currency`, and the language code of `document_language`. Do not write your own plotting code or change the colors. In the Markdown, replace the slot with `![<seriesName>](<slot_id>.png)` followed by the same values as a Markdown table, so every number stays readable and checkable.

**If you cannot run Python,** render the slot as text instead, as below.

**`markdown-table`:** the value is an array of `{ "label": string, "value": number }` with at least one row. Render:

```markdown
| Label | Value |
|---|---:|
| <label> | <value> |
```

**`mermaid-xy`:** the value is an object with `x` (strings), `series` (numbers), and optional `seriesName`. `x` and `series` must be the same length and non-empty. Render a Mermaid `xychart-beta` whose `bar` values are `series` and whose axis labels are `x`.

If any `x` label contains a double quote, a bracket, or a line break, render a two-column Markdown table of `x` and `series` instead of Mermaid.

If `render` is anything else, render a Markdown table of the cited figures and say the spec's render type is not supported yet.

## 6. Flowcharts and diagrams

Generate a code diagram when the user asks for a flowchart or diagram, or when the playbook has a `{{diagram:slot_id}}` slot. Do not add a diagram to a result just because it could use one.

Use Mermaid. Return a fenced `mermaid` code block. Never replace that block with a photo, screenshot, or generated image.

Read `template.md` and the schema before you write. Keep the section order and headings. Put the diagram in the slot, or in the existing section that describes the process. Do not add or rename a section to hold it.

A `{{diagram:slot_id}}` placeholder is the schema field `slot_id`. Its `x-diagram` value is a spec id. Fetch `https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/diagrams/<id>.json` and follow that spec. In the JSON, store the field as Mermaid source without code fences, starting with the spec's `mermaid` header, such as `flowchart TD`. In the Markdown, put that source in a fenced `mermaid` block where the slot was.

The diagram may only show steps, entities, decisions, and relationships from the user's context or cited research. If the process is incomplete, label the missing parts `Assumption:`. Do not invent integrations, decisions, or outcomes.

Pick the Mermaid type that fits:

- `flowchart TD` or `flowchart LR` for a workflow, a decision tree, or a business process.
- `sequenceDiagram` for people, systems, services, or APIs talking to each other.
- `erDiagram` for entities, attributes, and relationships.
- `stateDiagram-v2` for a lifecycle or status changes.
- `architecture-beta` only when the viewer supports it. Otherwise use a flowchart.

Use names a reader can understand. Label decision branches. Include a start and an end when the process has them. Split a long process into more than one diagram in the same section.

Check the Mermaid before you return it: the header is valid, every arrow names a node you defined, and the diagram matches the prose.

Writing the source and delivering a picture are different. Choose by where the document will be read:

- **Markdown viewers that render Mermaid** (GitHub, Cursor, Notion, most docs sites): the code block is enough.
- **PDF, Word, slides, or email**, which do not render Mermaid: render the source to a PNG or SVG if your tools can. Use Mermaid's own renderer, such as `npx @mermaid-js/mermaid-cli -i diagram.mmd -o diagram.png` in a terminal. Open the output to confirm the diagram is there before you embed it, and keep the source in the response.
- **When you cannot render it**, return the code block and tell the user in one line that it is Mermaid source and that they can paste it into a Mermaid renderer, such as mermaid.live.

Do not say an image was produced when you only wrote the code.

## 7. Validate and return

Keep a field object while you check the draft. Do not show that object to the user. Required context is present. Research fields are filled. Sources is a non-empty list when `research_mode` is `web`. Every number in the Markdown also appears in the field object. Chart series match the spec. Do not add facts in the prose that are not in that object.

Return only the filled Markdown, with no unknown markers. Do not append the field object, a "JSON" heading, or a second copy of the sources.

A person or CI job can confirm a saved fill with `node scripts/check-fill.mjs <template-id> <fill.json> [filled.md]`. That command is not part of the document.

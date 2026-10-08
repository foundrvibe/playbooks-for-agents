---
name: fill-template
description: >-
  Fills a document template from the user's context plus public research. Use
  when the user asks to fill a template, gives a template URL or template id,
  or describes a document that should match an intent in catalog.json. The
  catalog is the list of templates, including any added later.
---

# Fill a template

The user supplies context. You research and write the rest. The document shape stays fixed. Return a complete document. Do not leave sections unknown.

This file is the only link a user needs to send. Fetch the other files yourself. Do not ask the user for more links.

Base URL: `https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/`

| File | URL |
|---|---|
| Fill rules | `https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/rules/fill.md` |
| Catalog | `https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/catalog.json` |
| Chart script | `https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/charts/render_chart.py` |
| Chart specs | `https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/charts/<id>.json` |
| Diagram specs | `https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/diagrams/<id>.json` |
| Shared research guides | `https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/research/<name>.md` |

Read the fill rules before you write. They are the contract. This skill is the procedure.

Read the catalog at fill time. It lists `categories`, and each category lists template ids. Do not assume a fixed set of templates. A new template is a catalog entry plus `template.md`, `schema.json`, `example.json`, and `research.md`. The catalog entries already contain the raw URL of each file.

## 1. Resolve the template

Use the first case that fits.

- **URL.** The user pasted a raw URL to `template.md`, `schema.json`, or a template folder. Fetch `template.md`, `schema.json`, `example.json`, and `research.md` from that folder.
- **Id.** Find `id` in `catalog.json`. Fetch the four files at `files.template`, `files.schema`, `files.example`, and `files.research`.
- **Intent.** Compare the user's request to `intents` on templates whose `status` is `ready`. Ignore `status: "stub"`. If one ready template matches, use it. If more than one matches, ask which one and name its category. If none match, list the categories and their ready templates, and ask which one.

`example.json` shows a valid shape. Do not copy its facts into the user's document.

If the chosen template is a stub and the user asked for it by id or URL, say that it is a stub, then continue only if they still want that shape.

## 2. Collect context

Read the conversation and any files the user attached. Map that context onto schema fields.

The user does not need to provide every field. Treat their description of the company, product, and customer as the context. Ask only for required fields that this context still does not cover. Use each field's `x-ask`. Put those questions in one message, then wait.

Do not ask for market size, competitors, pricing, funding, operations, or team names when those fields are `research`.

Set `market_country` from the context when the template has it. Ask only if the context names no country. Set `document_language` to the language of the user's request unless they asked for another.

## 3. Research

Before researching, check whether you can open web pages in this session. If you cannot, tell the user in one line, set `research_mode` to `offline`, leave `sources` empty, and write every research field as an `Assumption:` built from the context. Do not write a citation for a page you did not open. If you can browse, set `research_mode` to `web`.

After you have the context, fetch the template's `research.md` from its catalog URL. It names each research field and links a shared guide. Fetch that guide from `https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/research/<name>.md` (the file name in the link, such as `market-size.md`). Fill every field whose `x-source` is `research` or `derived` before you write the document.

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
- Missing info lists only required context the user refused to give. When they gave the context, that section has no bullets.

## 5. Charts

A `{{chart:slot_id}}` placeholder is the schema field `slot_id`. Its `x-chart` value is a spec id. Fetch `https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/charts/<id>.json`. The series must match the spec and must be cited figures or a labeled assumption built from cited figures. Say that the range is derived from those values.

**If you can run Python** (ChatGPT data analysis, Claude code execution, a Cursor terminal), draw the chart yourself. Fetch `https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/charts/render_chart.py`, run it in your Python tool with the slot's JSON value, and show the PNG:

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

Generate a code diagram when the user asks for a flowchart or diagram, or when the template has a `{{diagram:slot_id}}` slot. Do not add a diagram to a fill just because the document could use one.

Use Mermaid. Return a fenced `mermaid` code block. Never replace that block with a photo, screenshot, or generated image.

Read the template and schema before you write. Keep the section order and headings. Put the diagram in the slot, or in the existing section that describes the process. Do not add or rename a section to hold it.

A `{{diagram:slot_id}}` placeholder is the schema field `slot_id`. Its `x-diagram` value is a spec id. Fetch `https://raw.githubusercontent.com/foundrvibe/templates-for-agents/dev/diagrams/<id>.json` and follow that spec. In the JSON, store the field as Mermaid source without code fences, starting with the spec's `mermaid` header, such as `flowchart TD`. In the Markdown, put that source in a fenced `mermaid` block where the slot was.

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

Check the field object against `schema.json` before you return it. Required context is present. Research fields are filled. Sources is a non-empty list when `research_mode` is `web`. Every number in the Markdown also appears in the JSON. Chart series match the spec.

A person or CI job can confirm the result with `node scripts/check-fill.mjs <template-id> <fill.json> [filled.md]`.

Then return:

1. The filled Markdown, with no unknown markers.
2. A JSON code block of the field object, so the fill can be re-rendered or diffed.

Do not add facts in the prose that are not in that JSON.

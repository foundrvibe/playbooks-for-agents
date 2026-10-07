---
name: fill-template
description: >-
  Fills a document template from facts the user provided. Use when the user
  asks to fill a template, gives a template URL or template id, or describes a
  document that should match an intent in catalog.json. The catalog is the
  list of templates, including any added later.
---

# Fill a template

Fill one template from facts the user actually gave. The document shape stays fixed. Numbers, dates, names, and quotes that the user did not provide stay blank.

Before filling, read and follow [rules/fill.md](../../rules/fill.md). Those rules are the contract. This skill is the procedure.

The catalog is [catalog.json](../../catalog.json). Read it at fill time. Do not assume a fixed set of templates. A new template is a catalog entry plus `template.md`, `schema.json`, and `example.json`. Use whatever is listed there.

## 1. Resolve the template

Use the first case that fits.

- **URL.** The user pasted a raw URL to `template.md`, `schema.json`, or a template folder. Fetch `template.md`, `schema.json`, and `example.json` from that folder.
- **Id.** Find `id` in `catalog.json`. Fetch the three files at `files.template`, `files.schema`, and `files.example`.
- **Intent.** Compare the user's request to `intents` on templates whose `status` is `ready`. Ignore `status: "stub"`. If one ready template matches, use it. If more than one matches, ask which one. If none match, say so and list the ready template ids from the catalog you just read.

`example.json` shows a valid shape, including a blank optional field. Do not copy its facts into the user's document.

If the chosen template is a stub and the user asked for it by id or URL, say that it is a stub, then continue only if they still want that shape.

## 2. Collect facts

Read the conversation and any files the user attached. Map values onto schema fields.

- Use a value only when the user stated it or it is in data they provided (`x-source` of `user` or `user_data`).
- A `derived` value may be computed only from those numbers, and the document must say which inputs it came from.
- Do not take facts from `example.json`, from memory of a typical case, or from a plausible guess.
- Do not invent revenue, prices, market size, growth rates, user counts, dates, percentages, customers, testimonials, team members, or partners.

## 3. Ask for what is missing

Before writing the document, list every required field you cannot fill. Ask the schema's `x-ask` question for each one. Put them in one message.

Wait for the answer. If the user declines a required field, render that field with its `x-unknown` text (default `_Unknown — not provided_`) and add it to `missing_info`.

Optional fields that are unknown use the same unknown text. Leave them blank. Do not write "approximately" or filler.

An assumption is allowed only when the user said to assume it. Render it with the label `Assumption:`.

## 4. Fill the Markdown

Use `template.md` as the only layout. Section headings come from that file. Do not add, drop, or rename them because a different template used different sections.

- Replace `{{field}}` with the value. If the value is null or missing, use `x-unknown`.
- Repeat a `{{#each collection}}` block once per item, replacing the inner placeholders from that item. If the collection is null or missing, render the field's `x-unknown` text once instead of the block. If the collection is an empty array, keep the section and render no items.
- If the template has a Missing info section, list each `missing_info` item there. An empty `missing_info` array means nothing required was declined, so that section has no bullets.

## 5. Charts

A `{{chart:slot_id}}` placeholder is the schema field `slot_id`. Its `x-chart` value is a spec id under [charts/](../../charts/). Fetch `charts/{id}.json`. Draw the chart only when the field's value matches that spec's `data` shape. Otherwise replace the slot with `No data provided`. Never use placeholder numbers.

New templates reuse these render types by setting `x-chart`. Read `render` from the spec:

**`markdown-table`:** the value is an array of `{ "label": string, "value": number }` with at least one row. Render:

```markdown
| Label | Value |
|---|---|
| <label> | <value> |
```

**`mermaid-xy`:** the value is an object with `x` (strings), `series` (numbers), and optional `seriesName`. `x` and `series` must be the same length and non-empty. Render a Mermaid `xychart-beta` whose `bar` values are `series` and whose axis labels are `x`. Set the y-axis range from the minimum and maximum of `series` only, and say in a following line that the range is derived from those values.

If any `x` label contains a double quote, a bracket, or a line break, render a two-column Markdown table of `x` and `series` instead of Mermaid.

If `render` is anything else, do not invent a chart. Write `No data provided` and tell the user that render type is not supported yet.

## 6. Validate and return

Check the field object against `schema.json` before you return it. Required strings are non-empty. Arrays match their item shape. Numbers are numbers the user provided. Chart fields either match the chart spec or are null.

Then return:

1. The filled Markdown.
2. A JSON code block of the field object, so the fill can be re-rendered or diffed.

Do not add facts in the prose that are not in that JSON.

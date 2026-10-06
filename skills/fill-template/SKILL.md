---
name: fill-template
description: >-
  Fills a FoundrVibe document template from facts the user provided. Use when
  the user asks to write or fill a PRD, product requirements document, business
  plan, letter, weekly report, or investor update, or when they give a
  FoundrVibe template URL, template id, or catalog intent.
---

# Fill a FoundrVibe template

Fill one template from facts the user actually gave. The document shape stays fixed. Numbers, dates, names, and quotes that the user did not provide stay blank.

Before filling, read and follow [rules/fill.md](../../rules/fill.md). On GitHub that file is `https://raw.githubusercontent.com/foundrvibe/templates/main/rules/fill.md`. Those rules are the contract. This skill is the procedure.

The catalog is [catalog.json](../../catalog.json), or `https://raw.githubusercontent.com/foundrvibe/templates/main/catalog.json`.

## 1. Resolve the template

Use the first case that fits.

- **URL.** The user pasted a raw URL to `template.md`, `schema.json`, or a template folder. Fetch `template.md`, `schema.json`, and `example.json` from that folder.
- **Id.** Find `id` in `catalog.json`. Fetch the three files at `files.template`, `files.schema`, and `files.example`.
- **Intent.** Compare the user's request to `intents` on templates whose `status` is `ready`. Ignore `status: "stub"`. If one ready template matches, use it. If more than one matches, ask which one. If none match, say so and list the ready template ids.

`example.json` shows a valid shape, including a blank optional field. Do not copy its facts into the user's document.

If the chosen template is a stub and the user asked for it by id or URL, say that it is a stub, then continue only if they still want that shape.

## 2. Collect facts

Read the conversation and any files the user attached. Map values onto schema fields.

- Use a value only when the user stated it or it is in data they provided (`x-source` of `user` or `user_data`).
- A `derived` value may be computed only from those numbers, and the document must say which inputs it came from.
- Do not take facts from `example.json`, from memory of a typical company, or from a plausible guess.
- Do not invent revenue, prices, market size, growth rates, user counts, dates, percentages, customers, testimonials, team members, or partners.

## 3. Ask for what is missing

Before writing the document, list every required field you cannot fill. Ask the schema's `x-ask` question for each one. Put them in one message.

Wait for the answer. If the user declines a required field, render that field with its `x-unknown` text (default `_Unknown — not provided_`) and add it to `missing_info`.

Optional fields that are unknown use the same unknown text. Leave them blank. Do not write "approximately" or filler.

An assumption is allowed only when the user said to assume it. Render it with the label `Assumption:`.

## 4. Fill the Markdown

Use `template.md` as the only layout.

- Replace `{{field}}` with the value. If the value is null or missing, use `x-unknown`.
- Repeat a `{{#each collection}}` block once per item, replacing the inner placeholders from that item. If the collection is null or missing, render the field's `x-unknown` text once instead of the block. If the collection is an empty array, keep the section and render no items.
- Do not add, drop, or rename sections. The Missing info section is already in the template. List each `missing_info` item there. An empty `missing_info` array means nothing required was declined, so that section has no bullets.

## 5. Charts

A `{{chart:slot_id}}` placeholder is the schema field `slot_id`. Its `x-chart` value is the spec id in `charts/` (`table` or `mermaid-xy`). Fetch that spec. Draw the chart only when the field's value matches the spec. Otherwise replace the slot with `No data provided`. Never use placeholder numbers.

**`table`** (`charts/table.json`): the value is an array of `{ "label": string, "value": number }` with at least one row. Render:

```markdown
| Label | Value |
|---|---|
| <label> | <value> |
```

**`mermaid-xy`** (`charts/mermaid-xy.json`): the value is an object with `x` (strings), `series` (numbers), and optional `seriesName`. `x` and `series` must be the same length and non-empty. Render a Mermaid `xychart-beta` whose `bar` values are `series` and whose axis labels are `x`. Set the y-axis range from the minimum and maximum of `series` only, and say in a following line that the range is derived from those values.

If any `x` label contains a double quote, a bracket, or a line break, render a two-column Markdown table of `x` and `series` instead of Mermaid.

## 6. Validate and return

Check the field object against `schema.json` before you return it. Required strings are non-empty. Arrays match their item shape. Numbers are numbers the user provided. Chart fields either match the chart spec or are null.

Then return:

1. The filled Markdown.
2. A JSON code block of the field object, so the fill can be re-rendered or diffed.

Do not add facts in the prose that are not in that JSON.

# Fill rules

Every fill must follow these rules.

1. **Keep the shape.** Use the template's sections in order. Don't add, drop, or rename sections. Headings stay as written in `template.md`, even when the prose is in another language.
2. **Ask only for context.** Before writing, ask for required fields you cannot get from the user's context. Use `x-ask`. Group them in one message. Do not ask the user to supply fields you can research.
3. **Research the rest.** For every `x-source` of `research`, follow the template's `research.md` and fill the field before you return the document. Research the `market_country` and write in the `document_language`.
4. **Never invent a source.** Cite only a page you opened during this fill. If you cannot browse, say so before you fill, set `research_mode` to `offline`, leave `sources` empty, and label every researched field `Assumption:`. A plausible URL you did not open is an invented source.
5. **Numbers need a source.** Revenue, prices, market size, growth rates, user counts, dates, and percentages must come from the user's context or a cited source. An estimate is allowed only when you label it `Assumption:` and show the inputs it comes from.
6. **No blank sections.** Do not render `_Unknown — not provided_`, "No data provided", or an empty optional section. Draft the section from context and research.
7. **Charts are projections you can explain.** Fill a chart slot from cited figures or from a labeled assumption built only from those figures. Say what the series is and where it came from. If you can run Python, draw it with `charts/render_chart.py` and put the same values in a table below the image.
8. **Diagrams use code.** When the user requests a flowchart or diagram, or the selected template defines a diagram slot, generate valid Mermaid source code based on the available context and research. Never substitute a photo or generated image. Preserve the template's structure, label assumptions, and validate the diagram before returning it.
9. **Don't invent people.** Do not create names, quotes, testimonials, or partners that are not in the context or a public source. If no one is named, list the roles the business needs.
10. **Label recommendations.** Legal form, funding amount, pricing, and cash on hand are recommendations when they are not in the context or a public filing. Put each one in Assumptions.
11. **Cite fully.** Every source has a title, publisher, URL, and the date you opened it. Every researched claim matches one source.
12. **Validate before returning.** Check the fill against `schema.json`. Missing info lists only required context the user refused to give. The rest of the document is filled.

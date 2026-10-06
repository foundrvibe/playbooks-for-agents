# Fill rules

Every fill must follow these rules.

1. **Keep the shape.** Use the template's sections in order. Don't add, drop, or rename sections.
2. **Required missing → ask.** Before writing, list every required field you don't have and ask the user. Use `x-ask` questions. Group them in one message where possible.
3. **Never invent numbers.** No revenue, prices, market size, growth rates, user counts, dates, or percentages unless the user gave them or they come from data the user provided.
4. **Unknowns stay blank.** If an optional field isn't known, render it as unknown. Don't guess, don't use "approximately", don't fill with plausible filler.
5. **Derived values must show their source.** If you compute something (e.g. a total from given line items), it must come only from provided numbers and say so.
6. **Charts only from real data.** Fill a chart slot only if the data was provided and matches the chart spec. Otherwise drop it or mark "no data provided".
7. **Don't fake names or quotes.** No invented customers, testimonials, team members, or partners.
8. **Flag assumptions.** If the user says "assume X", label it in the doc as an assumption.
9. **Validate before returning.** Check the fill against `schema.json`. If a required field is still missing (the user declined to answer), render it as unknown and list it at the end under "Missing info".
10. **Prose is allowed, facts are not.** The agent can write clear sentences around the user's facts. It can't add new facts.

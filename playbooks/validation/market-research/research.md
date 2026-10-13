# Market research

Read this after `schema.json`. Research the `market_country`, and write in the `document_language`. `template.md` is the result. These steps are the work.

Size the market bottom-up from buyer counts and prices. A big top-down figure is not a market for this product. Follow [market-size.md](../../../research/market-size.md) and judge every page with [source-evaluation.md](../../../research/source-evaluation.md).

## Display

Keep each table cell to one or two sentences. Do not put a `|` inside a cell. Leave a blank line between sections. The `market_chart` slot draws TAM, SAM, and SOM; do not draw a second chart of the same figures. Do not chart the other tables.

## Steps

1. Ask for `product`, `target_customer`, and `market_country` when the context does not already answer them. Ask for `known_research`: prices, customer counts, interviews, or reports the user already has. "None yet" is an answer. Wait.
2. Write `market_definition`: the buying unit (a business, a household, a person), what is in the market, and what is out. Web-search the industry, open an official code page, and give the code in `industry`.
3. Fill `segments` with the buyer groups inside the market, by observable traits such as size, sub-industry, or region. Web-search for establishment or firm counts, open the table or report page, and give the buyer count. If no page was opened, label it `Assumption:` and name the search and page type that would replace it. Never use a statistics API or an API key.
4. Fill `sizing_inputs` with every input the figures use: buyer counts, the share that fits, the annual price per buyer, and how many buyers the company can reach. Label each `given` (from the user), `sourced` (from a page you opened), or `assumption`. Use the user's price before a researched one.
5. Fill `market` in order: TAM, SAM, SOM. Each `formula` shows the multiplication in words and numbers. TAM is every buying unit times annual revenue per unit. SAM keeps only the units this product can serve now. SOM is the customers the company can win in a stated time, from its reach, never a percent of TAM. Copy the three figures into `market_chart` in the same order.
6. Fill `sensitivity` with a low, base, and high figure for each layer. Base equals the `market` figure. Name the input that moves each layer most.
7. Fill `trends` from official statistics, industry associations, and filings first. Each row cites the figure or the page and says whether it is a `tailwind`, a `headwind`, or `neutral` for this product.
8. Fill `demand_signals` from pages where buyers search, review, ask for, or pay for a solution: review sites, forums, directories, and search or trend pages. One row per page you opened. On the web, open at least three. Say when a search turned up nothing.
9. Fill `alternatives` with direct products, substitutes, and the status quo, using [competitors.md](../../../research/competitors.md). Open each website. On the web, list at least three.
10. Rate `attractiveness` in order: Size, Growth, Reachability, Competition. Set `verdict`: **attractive** only when every factor is medium or high and no key input is an assumption. **unattractive** when Size or Reachability is low. **promising with gaps** otherwise. `verdict_reason` is two sentences.
11. List each missing count or fact in `evidence_gaps` with how to close it. List every estimate in `assumptions` with its inputs, and every page you opened in `sources`.

## Where to look

- `industry`, `segments`, and buyer counts in `sizing_inputs`: [market-size.md](../../../research/market-size.md). Web-search first, then official HTML tables by industry code and employee size.
- Prices in `sizing_inputs`: the user's price, then [pricing.md](../../../research/pricing.md).
- `market`: the inputs above, multiplied. Never a percent of a top-down total.
- `trends`: national statistics releases, labor statistics for the customer's trade, industry associations, and public company filings. Trade press only for direction, not figures.
- `demand_signals`: review sites such as [G2](https://www.g2.com) and [Capterra](https://www.capterra.com), forums and community threads, directories, and search or trend pages.
- `alternatives`: [competitors.md](../../../research/competitors.md).

## Sources

- `sources`: one entry per page you opened, with title, publisher, URL, and the date you opened it. If you could not browse, set `research_mode` to `offline`, leave `sources` empty, and label every researched field `Assumption:`.

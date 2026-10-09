# Idea check

Read this after `schema.json`. Research the `market_country`, and write in the `document_language`. `template.md` is the result. These steps are the work.

Desk research is not validation. A page can show a problem and a competitor. Only a customer action, or a public page where buyers describe the pain, counts as pull.

## Display

Keep each table cell to one or two sentences. Do not put a paragraph in a cell. Do not put a `|` inside a cell. Leave a blank line between sections. The Competitors table and the Public signals table are long on purpose: one row per page you opened, short cells, no merged paragraphs. When TAM, SAM, and SOM are numbers, draw a chart of those three numbers under the Market table. Do not chart the other tables.

## Steps

1. Ask for `idea`, `target_customer`, and `market_country` when the context does not already answer them. Ask what `customer_tests` already exist: interviews, a landing page, signups, or payments. "None yet" is an answer. Wait.
2. Write `problem`, `who_affected`, and `workaround`. The workaround people use today is a competitor, even when it is email, a spreadsheet, or doing nothing. Set `pain_type` to `painkiller` only when a cited source or the user's own customer test shows people already act to stop the pain. Set it to `vitamin` when the idea is a nicer version of something that already works. Otherwise `unclear`.
3. Write `solution_fit` in one or two sentences: what would have to be true for the customer to switch.
4. Fill `market` with TAM, SAM, and SOM, using [market-size.md](../../../research/market-size.md). Show the count and the page. Never write "1% of the market" as SOM. If you did not open a count, label the figure `Assumption:` and name the missing count. When the three figures are numbers, chart them under the table.
5. Fill `competitors` from [competitors.md](../../../research/competitors.md). Search four places before you stop: the product category, close substitutes the customer already uses, software directories, and trade or marketplace listings. Open each website. On the web, include at least five distinct products and keep every other distinct one you open, up to twelve. Do not add a name you did not open. The status-quo workaround stays in `workaround`; add it as a competitor row only when it has a website. For each row, record one strength, one weakness, and how this idea differs. The difference comes only from that site and the user's idea.
6. Fill `community` from pages you opened, one row per page. On the web, open at least four different kinds: a review site, a forum or community thread, a search or trend page, and a directory, marketplace, or public social post. Add further pages you opened, up to eight. Each `finding` is what buyers said on that page, in one or two sentences. A directory listing is not customer pull unless buyers describe the pain there. If a search is empty, say which search returned nothing. That empty search does not replace the pages you did open. Do not invent influencers, quotes, or a sentiment score.
7. Fill the scorecard `checks` in this order: Pain, Market, Alternatives, Customer pull. `result` is `pass`, `gap`, or `fail`. Pain passes only for a cited painkiller. Market passes only when SOM is a count you opened, not a percent of TAM. Alternatives pass when a real site or a named workaround exists. Customer pull passes only when `customer_tests` or a public page shows an interview with a specific pain, a signup, or a payment.
8. Set `decision`. **go** when Pain, Alternatives, and Customer pull are `pass`. **no** when opened pages show the same offer already sold to the same customer and no cited difference, or when `pain_type` is `vitamin` and no pull exists. **not yet** for every other case. `decision_reason` is two sentences, naming the failed checks. `next_test` is one action: five customer conversations about the last time the workaround failed, or a landing page that asks for a signup or a payment. Do not recommend building the product while Customer pull is `gap` or `fail`.
9. List every estimate in `assumptions` and every page you opened in `sources`.

## Where to look

- `problem`, `who_affected`, `workaround`, and `solution_fit`: the user's idea, their tests, and [competitors.md](../../../research/competitors.md).
- `market`: [market-size.md](../../../research/market-size.md). Three rows, in order: TAM, SAM, SOM.
- `competitors`: [competitors.md](../../../research/competitors.md). Cover the category, close substitutes, [G2](https://www.g2.com), [Capterra](https://www.capterra.com), and the trade or marketplace where that customer already buys.
- `community`: a review page, a forum or community thread, a search or trend page, and a directory, marketplace, or public social post. One row per page. A directory listing is not pull unless buyers describe the problem there.

## Sources

- `sources`: one entry per page you opened, with title, publisher, URL, and the date you opened it. If you could not browse, set `research_mode` to `offline`, leave `sources` empty, and label every researched field `Assumption:`.

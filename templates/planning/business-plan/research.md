# Business plan research

Read this after `schema.json`. Ask the user first for any `user` or `user_data` field the context does not already answer. Research the `market_country`, and write in the `document_language`.

The seven sections follow a traditional plan: executive summary, company overview, products and services, market research, marketing and sales, operations, and finances. Put the support in the appendix.

## Market

- `industry`: classify with the official code search in [market-size.md](../../../research/market-size.md).
- `market_facts` and `market_analysis`: count the target businesses and find growth and trends with [market-size.md](../../../research/market-size.md). Each fact names the figure and the source. Show the bottom-up math in `market_analysis`.
- `opportunities` and `threats`: take these from the same market sources and from [competitors.md](../../../research/competitors.md).

## Competition

- `competitors`: list at least three real products found with [competitors.md](../../../research/competitors.md). Each row needs where it sells, its main offer, a strength, a weakness, and how this company differs.
- `strengths` and `weaknesses`: compare the context with those competitors.

## Offer and go to market

- `marketing_channels`: choose channels where the target customer already looks, using [competitors.md](../../../research/competitors.md) and [pricing.md](../../../research/pricing.md). Each row has a monthly spend, the activities, and a measure. Label a spend the user did not give as `Assumption:`.
- `sales_goals`: one row per forecast period, with customers, price, and revenue. The revenue column is the `financials` series, in the same order. Build it only from cited inputs with [pricing.md](../../../research/pricing.md).

## Operations

- `operations_items`: one row each for suppliers or production, fulfilment or delivery, inventory or hosting, and staff. Use the context and the norms in [company-facts.md](../../../research/company-facts.md).

## Financials

- `expenses`: annual cost rows for the first forecast year. Label amounts the user did not give as `Assumption:`.
- `financials`: the revenue chart. Its `series` equals the revenue column of `sales_goals`.

## Sources

- `sources`: one entry per page you opened, with title, publisher, URL, and the date you opened it. If you could not browse, set `research_mode` to `offline`, leave `sources` empty, and label every researched field `Assumption:`.

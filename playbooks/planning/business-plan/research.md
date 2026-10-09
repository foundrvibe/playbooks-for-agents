# Business plan research

Read this after `schema.json`. Research the `market_country`, and write in the `document_language`.

The seven sections follow a traditional plan: executive summary, company overview, products and services, market research, marketing and sales, operations, and finances. Put the support in the appendix. `template.md` is the result. These steps are the work.

## Steps

1. Ask for every `user` or `user_data` field the context does not already answer. Wait for the answer.
2. Classify `industry` for the market country.
3. Build `market_facts` and `market_analysis` from cited business counts. Then write `opportunities` and `threats`.
4. Find at least three real `competitors`. Write `strengths` and `weaknesses` from those pages and the context.
5. Fill offer prices, `marketing_channels`, and `sales_goals`. The revenue column of `sales_goals` is the `financials` series, in the same order. Chart that series under the sales table. Chart channel spend under the channel table when the spend cells are numbers.
6. Fill `operations_items` and `expenses` for the first forecast year. Chart the expense amounts under that table.
7. Write the executive summary, mission, values, objectives, and team from the context and the rows above. Do not invent a person's name.
8. List every estimate in `assumptions` and every page you opened in `sources`.

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

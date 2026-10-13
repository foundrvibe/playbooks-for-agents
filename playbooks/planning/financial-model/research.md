# Financial model

Read this after `schema.json`. Use the currency of the `market_country`, and write in the `document_language`. `template.md` is the result. These steps are the work.

A model is only as good as its drivers. Build from labeled drivers to monthly lines, then check that everything adds up. Follow [financial-modeling.md](../../../research/financial-modeling.md). Never present an assumed figure or a benchmark as this company's fact.

## Display

Keep each table cell to one or two sentences. Do not put a `|` inside a cell. Leave a blank line between sections. The `cash_chart` slot draws monthly cash; do not draw a second chart of it. Do not chart the other tables.

## Steps

1. Ask for `company_name`, `business_model`, `market_country`, and `target_region` when the context does not already answer them. Ask for `pricing`, `current_customers`, `current_mrr`, `starting_cash`, `forecast_months`, `costs`, and `hires`. Zero and "none planned" are answers. When the user has a business plan, reuse its price, cash, and costs, and ask only for what is missing. Wait.
2. Fill `benchmarks` from pages you opened: lifetime value to acquisition cost, acquisition cost payback, and churn or conversion benchmarks for this business model. On the web, open at least two. Say whose figure each is.
3. Fill `drivers` with every input: price, customers at the start, new customers per month, churn, each cost, and each hire. Label each `given` (from the user), `sourced` (from a page you opened), `derived` (calculated from other drivers), or `assumption`. The `basis` shows the source or formula.
4. Fill `monthly` with one row per month for `forecast_months`. Revenue is customers times price. Costs are the sum of `costs` and `hires` that have started. Net is revenue minus costs. Cash is last month's cash plus net, starting from `starting_cash`. Copy month labels and cash into `cash_chart` in the same order.
5. Fill `annual_summary` with Revenue, Cost of revenue, Gross profit, Operating expenses, and Net income for the period. Each is the sum of the months.
6. Write `break_even`: the first month revenue covers costs, and the customers it takes. Write `runway`: the lowest cash month, and cash divided by average monthly net burn; say "not limited" when the company is profitable.
7. Fill `unit_economics` with revenue per customer, gross margin, churn, lifetime value, acquisition cost, and payback. Show each formula. Say "not measurable" when spend or churn is not known.
8. Set `default_alive` with the check in [financial-modeling.md](../../../research/financial-modeling.md): `not enough data` when there is no revenue history to read a growth rate from, unless the plan reaches profit without any growth. `default_alive_reason` is two sentences.
9. Fill `scenarios` in order: Pessimistic, Base, Optimistic. Base equals the monthly table. Each other scenario changes only the drivers it names. Fill `sensitivity` with one driver changed at a time.
10. Set `funding_need` from the pessimistic lowest cash and a safety buffer; zero when cash stays above the buffer. Explain it in `funding_reason`.
11. Fill `reconciliation`: revenue equals customers times price in every month; ending cash equals starting cash plus net income; the annual summary equals the sum of the months; and any difference from another plan, such as a business plan forecast.
12. List every assumed driver in `assumptions`, and every page you opened in `sources`.

## Where to look

- `benchmarks`: [financial-modeling.md](../../../research/financial-modeling.md), [SaaS metrics](https://www.forentrepreneurs.com/saas-metrics-2/) for subscription businesses, and public pricing pages for payment or platform fees. Judge each with [source-evaluation.md](../../../research/source-evaluation.md).
- Default alive: [Default Alive or Default Dead?](https://www.paulgraham.com/aord.html).
- Prices and costs the user did not give: [pricing.md](../../../research/pricing.md), labeled `Assumption:`.

## Sources

- `sources`: one entry per page you opened, with title, publisher, URL, and the date you opened it. If you could not browse, set `research_mode` to `offline`, leave `sources` empty, and label every researched field `Assumption:`.

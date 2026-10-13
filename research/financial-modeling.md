# Financial modeling

Use this to build a monthly startup model, runway, and unit economics. It follows Paul Graham's [Default Alive or Default Dead?](https://www.paulgraham.com/aord.html) and David Skok's [SaaS metrics](https://www.forentrepreneurs.com/saas-metrics-2/).

## Build order

1. **Drivers first.** Price per plan, customers at the start, new customers per month, churn, cost per customer, fixed monthly costs, and hires with their start month. Label each driver `given`, `sourced`, `derived`, or `assumption`.
2. **Revenue:** customers in the month times price. Show the formula.
3. **Costs:** fixed costs plus variable costs plus payroll from each hire's start month.
4. **Net burn:** costs minus revenue. A negative net burn is profit.
5. **Cash:** last month's cash plus revenue minus costs, plus any funding received that month.
6. **Runway:** cash divided by average monthly net burn. When the company is profitable, say runway is not limited.
7. **Break-even:** the first month revenue covers costs, and the customer count it takes.

## Checks

- **Default alive:** keep costs as planned, apply the recent growth rate, and check whether the company reaches profitability before cash runs out. Answer `default alive`, `default dead`, or `not enough data` when there is no revenue history to read a growth rate from.
- **Unit economics:** lifetime value is monthly revenue per customer times gross margin divided by monthly churn. Customer acquisition cost is sales and marketing spend divided by new customers. Skok's benchmarks are lifetime value above three times acquisition cost and acquisition cost recovered within twelve months. Say "not measurable" when spend or churn is not known.
- **Scenarios:** a pessimistic, base, and optimistic case that change only the named drivers. Report year-end cash and runway for each.
- **Sensitivity:** change one driver at a time and report its effect.
- **Reconcile:** revenue equals customers times price in every month; cash at the end equals starting cash plus total revenue minus total costs plus funding; the annual summary equals the sum of the months.

## Rules

- Never present an assumed figure as a fact. A benchmark from a source is not this company's number.
- Do not hire faster than the model can pay for. Show the month each hire starts.
- Keep the currency of the `market_country`. Do not mix currencies.
- When another playbook already holds a figure, such as a price or a revenue forecast, reuse it or explain the difference in the reconciliation.

## Record

Add each page you opened to `sources` with title, publisher, URL, and the date you opened it.

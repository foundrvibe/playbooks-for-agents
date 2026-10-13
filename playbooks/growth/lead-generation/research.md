# Lead generation

Read this after `schema.json`. Research the `market_country` and scope work to `target_region`, and write in the `document_language`. `template.md` is the result. These steps are the work.

This is a system the founder runs, not a list the agent invents. Start from a sales hypothesis, filter prospects by observable signals, and track the funnel, as in Pete Koomen's [Enterprise sales for founders](https://www.ycombinator.com/library/LF-enterprise-sales-for-founders). Never invent a contact, a name, or an email address, and never send a message. Follow [sales-compliance.md](../../../research/sales-compliance.md) before writing any message.

## Display

Keep each table cell to one or two sentences. Do not put a `|` inside a cell. Leave a blank line between sections. The `funnel_chart` slot draws the funnel counts; do not chart the other tables.

## Steps

1. Ask for `product`, `target_customer`, `market_country`, and `target_region` when the context does not already answer them. Ask for `customer_goal`, `goal_period`, `sales_channels`, and `existing_leads`. "None yet" and "none given" are answers. Wait.
2. Write `sales_hypothesis` as: customer X has problem Y, and the product solves it by Z. Use customer evidence when the user has it.
3. Fill `qualification` with criteria a prospect must or should meet. Each `signal` is something visible before contact: size, location, services listed, tools mentioned, hiring, or a recent trigger. Mark the few that rule a prospect in or out `must have`.
4. Fill `scorecard` with three or four bands from best to worst. Each `rule` uses the qualification priorities; each `action` says what to do next and how soon.
5. Fill `lead_sources` with lawful public places to find prospects in `target_region`: local directories, chapter events, registries, and listings filtered to that city, province, or state. Open each one, and record its terms. Do not use bought lists or scraped personal emails.
6. Fill `prospect_fields` with what to record for each prospect: company, website, the qualifying signals, the contact's role, the public source of each fact, consent or lawful basis where needed, the date, and the pipeline stage.
7. Write `sequence` with two to six steps over two to three weeks. Lead with a fact the prospect published and the problem in the hypothesis, ask for a short call, and stop after the last step. Each message names the sender and says how to opt out. Use square brackets for the facts to fill in. Write `personalization` rules that use only facts the prospect published.
8. Fill `pipeline` with stages from identified to paying or lost, each with entry and exit rules the user can check.
9. Work `funnel` backwards from `customer_goal`: for each stage, a conversion rate and the count needed. The last count equals `customer_goal`. Label every rate the user did not measure `Assumption:`, and round counts up. Copy the stage names and counts into `funnel_chart` in the same order.
10. Fill `compliance` from [sales-compliance.md](../../../research/sales-compliance.md) for the `market_country`, citing the regulator's own page. On the web, list at least three rules.
11. Fill `metrics` with weekly metrics, formulas, and targets that match the funnel.
12. List every rate and estimate in `assumptions`, and every page you opened in `sources`.

## Where to look

- `lead_sources`: directories and marketplaces where the customer lists itself, the customer's trade association and its events, official business registries, and the user's own customers for referrals. Judge each with [source-evaluation.md](../../../research/source-evaluation.md).
- `compliance`: [sales-compliance.md](../../../research/sales-compliance.md). The regulator's own page for the `market_country`.
- Method: [Enterprise sales for founders](https://www.ycombinator.com/library/LF-enterprise-sales-for-founders) and the funnel section of [channels.md](../../../research/channels.md).

## Sources

- `sources`: one entry per page you opened, with title, publisher, URL, and the date you opened it. If you could not browse, set `research_mode` to `offline`, leave `sources` empty, and label every researched field `Assumption:`.

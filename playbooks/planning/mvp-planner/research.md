# MVP plan

Read this after `schema.json`. Research the `market_country` and scope first users and competitors to `target_region`, and write in the `document_language`. `template.md` is the result. These steps are the work.

An MVP is the smallest thing a narrow first group can get real value from, launched quickly so the team learns from real use. It follows Michael Seibel's [How to plan an MVP](https://www.ycombinator.com/library/6f-how-to-plan-an-mvp): time-box it, write the spec, cut the spec, and do not fall in love with it. Steps that do not scale are done by hand first, as in Paul Graham's [Do Things That Don't Scale](https://paulgraham.com/ds.html).

## Display

Keep each table cell to one or two sentences. Do not put a `|` inside a cell. Leave a blank line between sections. The `user_journey` slot draws the journey; do not draw another diagram of it. Do not chart these tables.

## Steps

1. Ask for `product`, `target_users`, `market_country`, and `target_region` when the context does not already answer them. Ask for `evidence`: interviews, signups, payments, or a customer discovery result. Ask for `constraints`: who builds it, how many weeks, budget, skills, and technology. "None yet" and "none given" are answers. Wait.
2. Write `first_users`: a group small enough to recruit by hand who feel the problem most, from the evidence. Narrower is better. Write `core_problem` as the one most urgent problem the evidence shows. When `evidence` says none yet, say the problem is unconfirmed and make the first build-plan period customer interviews, following [customer-evidence.md](../../../research/customer-evidence.md).
3. Write `value_hypothesis` as: if these users get this, they will do this, measured by this.
4. Fill `competitor_gaps` with products the first users could use instead, using [competitors.md](../../../research/competitors.md). Open each website. The gap comes only from that site and the evidence.
5. Draw `user_journey` as a Mermaid `flowchart TD` that follows the `business-process` diagram rules: one journey from the trigger to the moment the user gets value. Include only steps the first version or a manual step supports.
6. Fill `features` with every feature considered. `now` only when the journey breaks without it. `later` when it helps but the first users can get value without it. `never` when it serves a different user or problem. Cut until the now list fits the time box in `constraints`; when no time box is given, aim for a few weeks.
7. Write one `user_stories` row per now feature: "As a [user], I want [action], so that [outcome]." Acceptance is "Given [context], when [action], then [result]." Keep each story small, valuable, and testable.
8. Fill `manual_steps` with the work the team does by hand instead of building: onboarding, data entry, reports, or matching. Each `how` says who does it and when to automate it.
9. Fill `risks` across value, usability, feasibility, and viability, each with a mitigation in this plan.
10. Fill `build_plan` with time-boxed periods from spec to launch to first review. Each `done_when` is a check someone can confirm.
11. Set `primary_metric`: revenue when anyone pays, otherwise users completing the core action each week. Fill `launch_metrics` with targets. Write `decision_rule`: the result at the first review that means continue, change course, or stop.
12. List every belief the evidence did not confirm in `assumptions`, and every page you opened in `sources`.

## Where to look

- `competitor_gaps`: [competitors.md](../../../research/competitors.md). The products the first users already try, close substitutes, and directories.
- Method: [How to plan an MVP](https://www.ycombinator.com/library/6f-how-to-plan-an-mvp), [Do Things That Don't Scale](https://paulgraham.com/ds.html), and [INVEST in good stories](https://xp123.com/invest-in-good-stories-and-smart-tasks/).
- Metrics: [channels.md](../../../research/channels.md) for the primary metric and weekly target.

## Sources

- `sources`: one entry per page you opened, with title, publisher, URL, and the date you opened it. If you could not browse, set `research_mode` to `offline`, leave `sources` empty, and label every researched field `Assumption:`.

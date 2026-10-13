# Customer discovery

Read this after `schema.json`. Research the `market_country` and scope recruiting to `target_region`, and write in the `document_language`. `template.md` is the result. These steps are the work.

This playbook plans interviews and reads the notes the user supplies. It does not run interviews, and it never invents a person, a quote, or a result. Follow [customer-evidence.md](../../../research/customer-evidence.md).

## Display

Keep each table cell to one or two sentences. Do not put a `|` inside a cell. Leave a blank line between sections. Do not chart these tables; they hold no numbers that share a unit.

## Steps

1. Ask for `idea`, `target_customer`, `market_country`, and `target_region` when the context does not already answer them. Ask for `interview_notes`: the role of each person, the date, and what they said or did. "None yet" is an answer, and gives one row that says so. Wait.
2. Write `riskiest_assumption`: the single belief that sinks the idea if it is wrong, usually that this customer has the problem often and badly enough to change what they do.
3. Fill `customer_profile` with observable traits: segment, size, role of the person who feels the pain, the trigger that makes it urgent, the current workaround, and where they gather. Use the user's context and the pages you open.
4. Fill `public_context` from pages where this customer describes the problem or the workaround: forums, community threads, reviews of the tools they use now, or association resources. One row per page you opened. A page shows language and context; it is not an interview.
5. Fill `recruiting_channels` with real places to find people in `target_region` who match the profile: the user's own network, local associations, communities, directories, and events. Open each one. The `ask` is a short request for a conversation about their work, not a pitch.
6. Write `screening` questions that confirm fit before the interview: role, company type, and that the trigger happened recently.
7. Write `interview_guide` in order: Context, Last time, Cost, Workaround, Decision, Commitment. Use the five core questions from [customer-evidence.md](../../../research/customer-evidence.md). Every question asks about the past or the present. Never ask "Would you use this?", "Would you pay?", or a leading question. End with a commitment ask that fits the stage.
8. Fill `evidence` with one row per entry in `interview_notes`, using only what the notes say. Write "None given" in a cell the notes do not answer. When `interview_notes` says none yet, write one row that says no interviews yet.
9. Fill `signals` in order: Frequency, Severity, Current spend, Active search, Commitment. `strong` only for a specific recent case or a real commitment. Fill `forces` in order: Push, Pull, Anxiety, Habit.
10. Write `findings` in two or three sentences, keeping any conflict between interviews. List `limitations`: how many interviews, how people were recruited, and which segments are missing.
11. Set `decision`. **keep interviewing** when there are fewer than five interviews in the segment. **test a commitment** when Frequency and Severity are `strong`. **narrow the customer** when one sub-group shows the pain and others do not. **rethink the problem** when no interview shows the pain. Write one to three `next_experiments`, each with a success signal set before it starts and a time box.
12. List every belief no interview or page confirmed in `assumptions`, and every page you opened in `sources`.

## Where to look

- `public_context`: forums and community threads for the trade, reviews of the tools the customer uses now on [G2](https://www.g2.com) or [Capterra](https://www.capterra.com), and association resource pages. Judge each page with [source-evaluation.md](../../../research/source-evaluation.md).
- `recruiting_channels`: the trade association for the customer, its local chapters and events, professional communities, and public directories of businesses that match the profile.
- Interview method: [How to talk to users](https://www.ycombinator.com/library/JQ-how-to-start-a-startup-talking-to-users), [The Mom Test](https://www.momtestbook.com/), and the [switch interview](https://jobstobedone.org/switch-interview/).

## Sources

- `sources`: one entry per page you opened, with title, publisher, URL, and the date you opened it. If you could not browse, set `research_mode` to `offline`, leave `sources` empty, and label every researched field `Assumption:`.

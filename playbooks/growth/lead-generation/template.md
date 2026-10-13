# Lead generation: {{product}}

| | |
|---|---|
| **Customer** | {{target_customer}} |
| **Market** | {{market_country}} |
| **Goal** | {{customer_goal}} new customers, {{goal_period}} |
| **Language** | {{document_language}} |
| **Research** | {{research_mode}} |

## Sales hypothesis

{{sales_hypothesis}}

## Starting point

| Channel | Detail |
|---|---|
{{#each sales_channels}}
| {{channel}} | {{detail}} |
{{/each}}

| Existing lead source | Detail |
|---|---|
{{#each existing_leads}}
| {{source}} | {{detail}} |
{{/each}}

## Qualification

| Criterion | Signal | Priority |
|---|---|---|
{{#each qualification}}
| {{criterion}} | {{signal}} | {{priority}} |
{{/each}}

### Scorecard

| Band | Rule | Next action |
|---|---|---|
{{#each scorecard}}
| {{band}} | {{rule}} | {{action}} |
{{/each}}

## Where to find prospects

| Source | Website | What it gives | Terms to respect |
|---|---|---|---|
{{#each lead_sources}}
| {{source}} | {{website}} | {{gives}} | {{terms}} |
{{/each}}

### Record for each prospect

| Field | Why | Where from |
|---|---|---|
{{#each prospect_fields}}
| {{field}} | {{why}} | {{where_from}} |
{{/each}}

## Outreach sequence

Review every message before sending. The agent does not send messages.

| Timing | Channel | Message | Goal |
|---|---|---|---|
{{#each sequence}}
| {{timing}} | {{channel}} | {{message}} | {{goal}} |
{{/each}}

| Personalization rule |
|---|
{{#each personalization}}
| {{rule}} |
{{/each}}

## Pipeline

| Stage | Enters when | Leaves when |
|---|---|---|
{{#each pipeline}}
| {{stage}} | {{enters_when}} | {{leaves_when}} |
{{/each}}

## Funnel

| Stage | Rate | Count |
|---|---|---|
{{#each funnel}}
| {{stage}} | {{rate}} | {{count}} |
{{/each}}

{{chart:funnel_chart}}

## Outreach rules

This is a planning summary, not legal advice.

| Rule | Requirement | Law |
|---|---|---|
{{#each compliance}}
| {{rule}} | {{requirement}} | {{law}} |
{{/each}}

## Weekly metrics

| Metric | Formula | Target |
|---|---|---|
{{#each metrics}}
| {{metric}} | {{formula}} | {{target}} |
{{/each}}

## Assumptions

| Assumption |
|---|
{{#each assumptions}}
| {{text}} |
{{/each}}

## Sources

| Title | Publisher | URL | Accessed |
|---|---|---|---|
{{#each sources}}
| {{title}} | {{publisher}} | {{url}} | {{accessed}} |
{{/each}}

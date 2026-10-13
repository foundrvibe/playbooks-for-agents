# Go-to-market plan: {{product}}

| | |
|---|---|
| **Stage** | {{stage}} |
| **Customer** | {{target_customer}} |
| **Market** | {{market_country}} |
| **Region** | {{target_region}} |
| **Monthly budget** | {{monthly_budget}} |
| **Team** | {{team_capacity}} |
| **Language** | {{document_language}} |
| **Research** | {{research_mode}} |
| **Primary metric** | {{primary_metric}} |
| **Weekly target** | {{weekly_target}} |

## Positioning

{{value_proposition}}

| Component | Statement |
|---|---|
{{#each positioning}}
| {{component}} | {{statement}} |
{{/each}}

### What buyers use today

| Alternative | Kind | Website | Why they use it |
|---|---|---|---|
{{#each competitive_alternatives}}
| {{alternative}} | {{kind}} | {{website}} | {{why_used}} |
{{/each}}

## Buyers

| Role | Part in the decision | Cares about |
|---|---|---|
{{#each buyer_roles}}
| {{role}} | {{part}} | {{cares_about}} |
{{/each}}

## Offer and pricing

| Offer | Price | Basis |
|---|---|---|
{{#each offer}}
| {{offer}} | {{price}} | {{basis}} |
{{/each}}

## Messaging

| Audience | Message | Proof |
|---|---|---|
{{#each messaging}}
| {{audience}} | {{message}} | {{proof}} |
{{/each}}

## Channels

### Already in hand

| Asset | Detail |
|---|---|
{{#each existing_audience}}
| {{asset}} | {{detail}} |
{{/each}}

### Candidates

| Channel | Website | Fit | Status |
|---|---|---|---|
{{#each channels}}
| {{channel}} | {{website}} | {{fit}} | {{status}} |
{{/each}}

### Tests

| Channel | Test | Cost | Time box | Success threshold |
|---|---|---|---|---|
{{#each channel_tests}}
| {{channel}} | {{test}} | {{cost}} | {{time_box}} | {{success_threshold}} |
{{/each}}

{{chart:test_budget}}

## Launch plan

| Period | Actions | Milestone |
|---|---|---|
{{#each launch_plan}}
| {{period}} | {{actions}} | {{milestone}} |
{{/each}}

## Metrics

| KPI | Target | Measured how |
|---|---|---|
{{#each kpis}}
| {{kpi}} | {{target}} | {{measured_how}} |
{{/each}}

## Risks

| Risk | Response |
|---|---|
{{#each risks}}
| {{risk}} | {{response}} |
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

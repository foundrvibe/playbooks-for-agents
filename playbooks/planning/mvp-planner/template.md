# MVP plan: {{product}}

| | |
|---|---|
| **Users** | {{target_users}} |
| **Market** | {{market_country}} |
| **Language** | {{document_language}} |
| **Research** | {{research_mode}} |
| **Primary metric** | {{primary_metric}} |

## Focus

| | |
|---|---|
| **First users** | {{first_users}} |
| **Core problem** | {{core_problem}} |
| **Value hypothesis** | {{value_hypothesis}} |

## Evidence

| Source | Finding |
|---|---|
{{#each evidence}}
| {{source}} | {{finding}} |
{{/each}}

## Constraints

| Constraint | Detail |
|---|---|
{{#each constraints}}
| {{constraint}} | {{detail}} |
{{/each}}

## Gaps in what exists

| Product | Website | Gap the first version fills |
|---|---|---|
{{#each competitor_gaps}}
| {{name}} | {{website}} | {{gap}} |
{{/each}}

## User journey

{{diagram:user_journey}}

## Scope

| Feature | Scope | Reason |
|---|---|---|
{{#each features}}
| {{feature}} | {{scope}} | {{reason}} |
{{/each}}

## User stories

| Story | Acceptance criteria |
|---|---|
{{#each user_stories}}
| {{story}} | {{acceptance}} |
{{/each}}

## Done by hand first

| Step | How |
|---|---|
{{#each manual_steps}}
| {{step}} | {{how}} |
{{/each}}

## Risks

| Risk | Kind | Mitigation |
|---|---|---|
{{#each risks}}
| {{risk}} | {{kind}} | {{mitigation}} |
{{/each}}

## Build plan

| Period | Work | Done when |
|---|---|---|
{{#each build_plan}}
| {{period}} | {{work}} | {{done_when}} |
{{/each}}

## Launch metrics

| Metric | Target | Why |
|---|---|---|
{{#each launch_metrics}}
| {{metric}} | {{target}} | {{why}} |
{{/each}}

{{decision_rule}}

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

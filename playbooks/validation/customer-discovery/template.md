# Customer discovery: {{idea}}

| | |
|---|---|
| **Customer** | {{target_customer}} |
| **Market** | {{market_country}} |
| **Region** | {{target_region}} |
| **Language** | {{document_language}} |
| **Research** | {{research_mode}} |
| **Decision** | {{decision}} |

## Riskiest assumption

{{riskiest_assumption}}

## Best-fit customer

| Trait | Value |
|---|---|
{{#each customer_profile}}
| {{trait}} | {{value}} |
{{/each}}

## What the customer says in public

| Page | What turned up |
|---|---|
{{#each public_context}}
| {{page}} | {{finding}} |
{{/each}}

## Where to recruit

| Channel | Website | Ask |
|---|---|---|
{{#each recruiting_channels}}
| {{channel}} | {{website}} | {{ask}} |
{{/each}}

## Screening

| Question | Qualifies when |
|---|---|
{{#each screening}}
| {{question}} | {{qualifies}} |
{{/each}}

## Interview guide

Ask about the last real case. Do not pitch, and do not ask whether they would use or pay for the idea.

| Stage | Question | Listen for |
|---|---|---|
{{#each interview_guide}}
| {{stage}} | {{question}} | {{listen_for}} |
{{/each}}

## Interviews so far

| Who | Date | Notes |
|---|---|---|
{{#each interview_notes}}
| {{who}} | {{date}} | {{notes}} |
{{/each}}

## Evidence

| Who | Behavior | Pain | Workaround | Commitment |
|---|---|---|---|---|
{{#each evidence}}
| {{who}} | {{behavior}} | {{pain}} | {{workaround}} | {{commitment}} |
{{/each}}

## Signals

| Signal | Strength | Finding |
|---|---|---|
{{#each signals}}
| {{signal}} | {{strength}} | {{finding}} |
{{/each}}

## Switching forces

| Force | Finding |
|---|---|
{{#each forces}}
| {{force}} | {{finding}} |
{{/each}}

## Findings

{{findings}}

| Limitation |
|---|
{{#each limitations}}
| {{text}} |
{{/each}}

## Next experiments

| Experiment | Success signal | Time box |
|---|---|---|
{{#each next_experiments}}
| {{experiment}} | {{success_signal}} | {{time_box}} |
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

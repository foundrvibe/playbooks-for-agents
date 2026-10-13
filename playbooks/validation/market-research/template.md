# Market research: {{product}}

| | |
|---|---|
| **Customer** | {{target_customer}} |
| **Market** | {{market_country}} |
| **Region** | {{target_region}} |
| **Industry** | {{industry}} |
| **Language** | {{document_language}} |
| **Research** | {{research_mode}} |
| **Verdict** | {{verdict}} |

## Attractiveness

| Factor | Rating | Evidence |
|---|---|---|
{{#each attractiveness}}
| {{factor}} | {{rating}} | {{evidence}} |
{{/each}}

{{verdict_reason}}

## Market definition

{{market_definition}}

| Segment | Traits | Buyers |
|---|---|---|
{{#each segments}}
| {{segment}} | {{traits}} | {{buyers}} |
{{/each}}

## Market size

| Layer | Formula | Figure | Basis |
|---|---|---|---|
{{#each market}}
| {{layer}} | {{formula}} | {{figure}} | {{basis}} |
{{/each}}

SOM is the customers this company can win in a stated time, from its reach or a count you opened. It is not a slice of TAM.

{{chart:market_chart}}

### Inputs

| Input | Value | Label | Basis |
|---|---|---|---|
{{#each sizing_inputs}}
| {{input}} | {{value}} | {{label}} | {{basis}} |
{{/each}}

### Range

| Layer | Low | Base | High | Moves most with |
|---|---|---|---|---|
{{#each sensitivity}}
| {{layer}} | {{low}} | {{base}} | {{high}} | {{driver}} |
{{/each}}

## Trends

| Trend | Evidence | Effect |
|---|---|---|
{{#each trends}}
| {{trend}} | {{evidence}} | {{effect}} |
{{/each}}

## Demand signals

| Signal | What turned up |
|---|---|
{{#each demand_signals}}
| {{signal}} | {{finding}} |
{{/each}}

## Alternatives buyers use

| Name | Kind | Website | What it means |
|---|---|---|---|
{{#each alternatives}}
| {{name}} | {{kind}} | {{website}} | {{note}} |
{{/each}}

## What the user already had

| Item | Detail |
|---|---|
{{#each known_research}}
| {{item}} | {{detail}} |
{{/each}}

## Evidence gaps

| Gap | How to close it |
|---|---|
{{#each evidence_gaps}}
| {{gap}} | {{how_to_close}} |
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

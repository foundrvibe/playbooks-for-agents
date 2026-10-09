# {{idea}}

| | |
|---|---|
| **Customer** | {{target_customer}} |
| **Market** | {{market_country}} |
| **Language** | {{document_language}} |
| **Research** | {{research_mode}} |
| **Decision** | {{decision}} |

## Scorecard

| Check | Result | Evidence |
|---|---|---|
{{#each checks}}
| {{name}} | {{result}} | {{evidence}} |
{{/each}}

{{decision_reason}}

## The problem

| | |
|---|---|
| **Problem** | {{problem}} |
| **Who feels it** | {{who_affected}} |
| **Current workaround** | {{workaround}} |
| **Painkiller or vitamin** | {{pain_type}} |
| **How this idea addresses it** | {{solution_fit}} |

## Market

| Layer | Figure | Basis |
|---|---|---|
{{#each market}}
| {{layer}} | {{figure}} | {{basis}} |
{{/each}}

SOM is the customers this idea can reach, from a count you opened or a labeled assumption. It is not a slice of TAM.

## Competitors

| Name | Website | Strength | Weakness | How this idea differs |
|---|---|---|---|---|
{{#each competitors}}
| {{name}} | {{website}} | {{strength}} | {{weakness}} | {{difference}} |
{{/each}}

## Already tested

| Test | What happened |
|---|---|
{{#each customer_tests}}
| {{test}} | {{result}} |
{{/each}}

## Public signals

| Signal | What turned up |
|---|---|
{{#each community}}
| {{signal}} | {{finding}} |
{{/each}}

## Next test

{{next_test}}

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

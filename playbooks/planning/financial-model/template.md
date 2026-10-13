# Financial model: {{company_name}}

| | |
|---|---|
| **Business model** | {{business_model}} |
| **Market** | {{market_country}} |
| **Customers now** | {{current_customers}} |
| **Recurring revenue now** | {{current_mrr}} per month |
| **Starting cash** | {{starting_cash}} |
| **Months modeled** | {{forecast_months}} |
| **Language** | {{document_language}} |
| **Research** | {{research_mode}} |
| **Default alive** | {{default_alive}} |

## Summary

| | |
|---|---|
| **Break-even** | {{break_even}} |
| **Runway** | {{runway}} |
| **Default alive check** | {{default_alive_reason}} |
| **Funding need** | {{funding_need}} |
| **Funding reason** | {{funding_reason}} |

## Inputs

### Pricing

| Plan | Price | Unit |
|---|---|---|
{{#each pricing}}
| {{plan}} | {{price}} | {{unit}} |
{{/each}}

### Costs

| Item | Monthly | Kind | Label |
|---|---|---|---|
{{#each costs}}
| {{item}} | {{monthly}} | {{kind}} | {{label}} |
{{/each}}

### People

| Role | Monthly cost | Start |
|---|---|---|
{{#each hires}}
| {{role}} | {{monthly_cost}} | {{start}} |
{{/each}}

### Drivers

| Driver | Value | Label | Basis |
|---|---|---|---|
{{#each drivers}}
| {{driver}} | {{value}} | {{label}} | {{basis}} |
{{/each}}

## Monthly forecast

| Month | Customers | Revenue | Costs | Net | Cash |
|---|---|---|---|---|---|
{{#each monthly}}
| {{month}} | {{customers}} | {{revenue}} | {{costs}} | {{net}} | {{cash}} |
{{/each}}

{{chart:cash_chart}}

## Annual summary

| Line | Amount |
|---|---|
{{#each annual_summary}}
| {{line}} | {{amount}} |
{{/each}}

## Unit economics

| Metric | Value | Formula |
|---|---|---|
{{#each unit_economics}}
| {{metric}} | {{value}} | {{formula}} |
{{/each}}

### Benchmarks

| Metric | Benchmark | Source |
|---|---|---|
{{#each benchmarks}}
| {{metric}} | {{benchmark}} | {{source}} |
{{/each}}

## Scenarios

| Scenario | Change | Revenue | Ending cash | Lowest cash |
|---|---|---|---|---|
{{#each scenarios}}
| {{scenario}} | {{change}} | {{revenue}} | {{ending_cash}} | {{lowest_cash}} |
{{/each}}

## Sensitivity

| Driver | Change | Ending cash |
|---|---|---|
{{#each sensitivity}}
| {{driver}} | {{change}} | {{ending_cash}} |
{{/each}}

## Reconciliation

| Check | Result |
|---|---|
{{#each reconciliation}}
| {{check}} | {{result}} |
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

# {{company_name}}

| | |
|---|---|
| **Owner** | {{owner}} |
| **Status** | {{status}} |
| **Last updated** | {{last_updated}} |
| **Format** | {{plan_format}} |
| **Audience** | {{audience}} |
| **Location** | {{location}} |
| **Market** | {{market_country}} |
| **Language** | {{document_language}} |
| **Legal structure** | {{legal_structure}} |
| **Research** | {{research_mode}} |

## Executive summary

{{executive_summary}}

## Company overview

| | |
|---|---|
| **Business structure** | {{legal_structure}} |
| **Industry** | {{industry}} |
| **Business model** | {{business_model}} |
| **Background** | {{business_concept}} |
| **Mission** | {{mission}} |

### Objectives

| Horizon | Objective |
|---|---|
{{#each objectives}}
| {{horizon}} | {{text}} |
{{/each}}

### Values

| Value |
|---|
{{#each values}}
| {{text}} |
{{/each}}

### Leadership

| Name | Role | Background |
|---|---|---|
{{#each team}}
| {{name}} | {{role}} | {{background}} |
{{/each}}

## Products and services

{{products_and_services}}

| Offer | Type | Price | Why it stands out |
|---|---|---|---|
{{#each offers}}
| {{name}} | {{kind}} | {{price}} | {{difference}} |
{{/each}}

## Market research

### Target customer

| | |
|---|---|
| **Who** | {{target_customer}} |
| **Problem** | {{customer_problem}} |
| **Why this offer** | {{competitive_advantage}} |

### Market opportunity

| Fact | Figure | Note |
|---|---|---|
{{#each market_facts}}
| {{label}} | {{figure}} | {{note}} |
{{/each}}

{{market_analysis}}

### Competitors

| Competitor | Where | Main offer | Strengths | Weaknesses | How we differ |
|---|---|---|---|---|---|
{{#each competitors}}
| {{name}} | {{location}} | {{offer}} | {{strengths}} | {{weaknesses}} | {{difference}} |
{{/each}}

### SWOT

| | Helpful | Harmful |
|---|---|---|
| **Internal** | {{strengths}} | {{weaknesses}} |
| **External** | {{opportunities}} | {{threats}} |

## Marketing and sales

| Channel | Monthly spend | Activities | Measure |
|---|---:|---|---|
{{#each marketing_channels}}
| {{channel}} | {{monthly_spend}} | {{activities}} | {{measure}} |
{{/each}}

### Sales goals

| Period | Customers | Price | Revenue |
|---|---:|---:|---:|
{{#each sales_goals}}
| {{period}} | {{customers}} | {{price}} | {{revenue}} |
{{/each}}

## Operations

| Area | Plan |
|---|---|
{{#each operations_items}}
| {{area}} | {{plan}} |
{{/each}}

## Finances

### Current snapshot

| Metric | Value |
|---|---:|
| Paying customers | {{current_customers}} |
| Current recurring revenue | {{current_revenue}} |
{{#each snapshot}}
| {{metric}} | {{value}} |
{{/each}}

### Revenue forecast

{{chart:financials}}

### Expenses

| Category | Annual cost |
|---|---:|
{{#each expenses}}
| {{category}} | {{annual_cost}} |
{{/each}}

### Funding

| | |
|---|---|
| **Capital on hand** | {{starting_capital}} |
| **Funding request** | {{funding_request}} |

| Use | Amount |
|---|---:|
{{#each use_of_funds}}
| {{item}} | {{amount}} |
{{/each}}

## Appendix

### Assumptions

| Assumption |
|---|
{{#each assumptions}}
| {{text}} |
{{/each}}

### Review

{{review_cadence}}

### Sources

| Title | Publisher | URL | Accessed |
|---|---|---|---|
{{#each sources}}
| {{title}} | {{publisher}} | {{url}} | {{accessed}} |
{{/each}}

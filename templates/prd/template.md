# {{product_name}}

| | |
|---|---|
| **Owner** | {{owner}} |
| **Status** | {{status}} |
| **Last updated** | {{last_updated}} |
| **Target launch** | {{launch_date}} |

## Summary

{{summary}}

## Problem

{{problem}}

## Goals

{{#each goals}}
- {{text}}
{{/each}}

## Non-goals

{{#each non_goals}}
- {{text}}
{{/each}}

## Users

{{#each users}}
- **{{role}}:** {{need}}
{{/each}}

## User stories

{{#each user_stories}}
- As a {{role}}, I {{action}}.
{{/each}}

## Requirements

{{#each requirements}}
- **{{id}}** {{text}}
{{/each}}

## Success metrics

{{chart:metrics}}

## Open questions

{{#each open_questions}}
- {{text}}
{{/each}}

## Missing info

{{#each missing_info}}
- {{text}}
{{/each}}

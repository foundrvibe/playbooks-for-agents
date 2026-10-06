# PRD: FoundrVibe Templates (working title)

| | |
|---|---|
| **Company** | FoundrVibe ([foundrvibe.com](https://foundrvibe.com)) |
| **Owner** | Koceila Abbas |
| **Status** | Draft v0.1 |
| **Last updated** | 2026-10-06 |

---

## 1. Summary

FoundrVibe Templates is a public GitHub repo of fillable document templates (PRD, business plan, letter, weekly report) built for AI agents. Each template is a Markdown file with a `schema.json` that defines its fields and an `example.json` that shows a correct fill.

Agents load a template by URL, id, or intent. They fill it using **one shared fill skill**, which has strict rules: required fields that are missing get asked to the user, unknowns stay blank, and numbers are never invented. Chart slots are optional and only filled from real data.

The goal: the same request gives the same document shape every time, and every fact in the output came from the user or their data.

---

## 2. Problem

- Agents write PRDs, business plans, letters, and reports with no fixed structure. Every run looks different.
- When facts are missing, agents make them up: revenue, market size, dates, headcount, metrics.
- Founders can't trust the output, can't compare versions, and spend time rewriting structure and checking for invented facts.
- Current "templates" are mostly prompt dumps. There's no contract for what's required, what's optional, or what to do when data is missing.
- Each agent (ChatGPT, Claude, Cursor) needs its own setup. Nothing works across all of them.

---

## 3. Goals / Non-goals

### Goals
1. Give agents a fixed, versioned document shape they can load and complete.
2. Make honest fills the default: ask for required fields, leave unknowns blank, never invent.
3. Work across agents today with just a URL (ChatGPT, Claude, Cursor).
4. Keep it simple: one fill skill for all templates, not one skill per template.
5. Make adding a new template a small, predictable job (Markdown + schema + example).

### Non-goals (for MVP)
- Building a full MCP plugin/server.
- Paid plans or accounts.
- A UI for companies to build custom templates.
- A live chart rendering service.
- Writing content for the user. The system structures and fills from given facts; it is not a ghostwriter that makes up substance.

---

## 4. Users

| User | What they need |
|---|---|
| **Founders / operators** (primary) | Consistent docs (PRD, business plan, updates) from their agent without invented facts. |
| **AI agents** (ChatGPT, Claude, Cursor, others) | A machine-readable template and clear rules they can follow without guessing. |
| **Developers building agents/workflows** | Stable template ids and schemas they can wire into their own tools. |
| **Contributors** (later) | A clear contract for adding new templates. |

---

## 5. User stories

1. As a founder, I tell my agent "write a PRD for X" and get a doc with the same sections every time.
2. As a founder, when I haven't given a required fact (e.g. target launch date), the agent asks me instead of making it up.
3. As a founder, when I don't know something optional, the field stays blank or is marked unknown, not filled with a guess.
4. As a founder, I can paste a template URL into ChatGPT or Claude and it just works.
5. As a founder, I only get charts when I've given real data. No placeholder or made-up numbers.
6. As an agent, I can read `catalog.json` to find the right template from the user's intent ("investor update" → `weekly-report` or similar).
7. As an agent, I can validate my fill against `schema.json` before returning it.
8. As a developer, I can pin a template version so my workflow doesn't break when the template changes.
9. As a contributor, I can add a template by copying an existing folder and following the contract.

---

## 6. Functional requirements

### 6.1 Repo structure

```
/
├── README.md              # How agents use templates (URL / id / intent)
├── catalog.json           # Index of all templates
├── rules/
│   └── fill.md            # The shared fill rules (the "fill contract")
├── skills/
│   └── fill-template/     # The one shared fill skill
├── charts/                # Chart slot specs (types, required data shape)
└── templates/
    ├── prd/
    │   ├── template.md
    │   ├── schema.json
    │   └── example.json
    ├── business-plan/
    ├── letter/
    └── weekly-report/
```

### 6.2 Catalog
- **FR-1** `catalog.json` lists every template with: `id`, `name`, `version`, `description`, `intents` (phrases/keywords that map to it), and paths/raw URLs to `template.md`, `schema.json`, `example.json`.
- **FR-2** Template ids are stable, lowercase, kebab-case (`prd`, `business-plan`).

### 6.3 Loading
- **FR-3 By URL:** agent fetches a raw GitHub URL to a template folder file or the catalog.
- **FR-4 By id:** agent resolves the id through `catalog.json`.
- **FR-5 By intent:** agent matches the user's request against `intents` in the catalog. If more than one template matches, agent asks the user which one.

### 6.4 Fill skill
- **FR-6** One skill (`fill-template`) handles every template. No template-specific skills.
- **FR-7** The skill: load template + schema → collect facts from the conversation and given files → list missing required fields → ask the user → fill → validate against schema → render Markdown.
- **FR-8** The skill follows `rules/fill.md` (see section 8).
- **FR-9** Output is the filled Markdown. Optionally also the filled JSON (field values), so it can be re-rendered or diffed.

### 6.5 Charts
- **FR-10** Templates can declare optional chart slots. Each slot references a chart spec in `charts/` (type and required data shape).
- **FR-11** A chart slot is filled only if the user gave real data that matches the spec. Otherwise the slot is removed or left with a "no data provided" note.
- **FR-12** MVP charts render as Markdown tables or Mermaid (no rendering service).

### 6.6 Docs
- **FR-13** README shows, with copy-paste examples, how to use a template by URL, id, and intent in ChatGPT, Claude, and Cursor.
- **FR-14** Each template has an `example.json` that passes its own schema and shows a correct, honest fill (including at least one blank optional field).

---

## 7. Template file contract

Every template folder has exactly three files.

### `template.md`
- The document layout in Markdown with placeholders, e.g. `{{product_name}}`, `{{#each goals}}...{{/each}}`.
- Section headings are fixed. Agents don't add, remove, or rename sections.
- Chart slots marked as `{{chart:slot_id}}`.

### `schema.json` (JSON Schema)
- Defines every field: `type`, `description`, and whether it's `required`.
- Custom keys per field:
  - `x-ask`: the question to ask the user if the field is missing and required.
  - `x-source`: where the value must come from (`user`, `user_data`, `derived`). Numbers default to `user` or `user_data`.
  - `x-unknown`: how to render a blank field (default: `_Unknown — not provided_`).
- Template metadata: `id`, `version` (semver), `title`.

### `example.json`
- A complete, valid example fill.
- Must validate against `schema.json`.
- Must include at least one optional field left blank to show the right behavior.

### Versioning
- Breaking changes to schema (renamed/removed required fields) = major version bump.
- Agents can pin a version via git tag or versioned URL. Default is latest on `main`.

---

## 8. Agent fill rules (`rules/fill.md`)

These are the core of the product. Every fill must follow them.

1. **Keep the shape.** Use the template's sections in order. Don't add, drop, or rename sections.
2. **Required missing → ask.** Before writing, list every required field you don't have and ask the user. Use `x-ask` questions. Group them in one message where possible.
3. **Never invent numbers.** No revenue, prices, market size, growth rates, user counts, dates, or percentages unless the user gave them or they come from data the user provided.
4. **Unknowns stay blank.** If an optional field isn't known, render it as unknown. Don't guess, don't use "approximately", don't fill with plausible filler.
5. **Derived values must show their source.** If you compute something (e.g. a total from given line items), it must come only from provided numbers and say so.
6. **Charts only from real data.** Fill a chart slot only if the data was provided and matches the chart spec. Otherwise drop it or mark "no data provided".
7. **Don't fake names or quotes.** No invented customers, testimonials, team members, or partners.
8. **Flag assumptions.** If the user says "assume X", label it in the doc as an assumption.
9. **Validate before returning.** Check the fill against `schema.json`. If a required field is still missing (the user declined to answer), render it as unknown and list it at the end under "Missing info".
10. **Prose is allowed, facts are not.** The agent can write clear sentences around the user's facts. It can't add new facts.

---

## 9. Non-functional requirements

- **Works with zero install:** any agent that can fetch a URL can use it.
- **Plain files:** Markdown and JSON only. Readable by humans, parseable by machines.
- **Deterministic structure:** same template + same inputs → same sections and field layout.
- **Small context footprint:** a template + schema + fill rules should fit easily in an agent's context. Target size is an open question (see section 12).
- **Stable URLs:** raw file paths don't move without a major version bump and a redirect/notice.
- **License:** open license so anyone can use and fork. Specific license TBD (see section 12).
- **Validation in CI:** every `example.json` validates against its `schema.json` on every PR.

---

## 10. MVP vs later

| Area | MVP | Later |
|---|---|---|
| Repo | Public repo, catalog.json, rules/fill.md, charts/, templates folder | Contributor guide, community templates |
| Templates | PRD, business plan (fully done). Letter and weekly report folders stubbed. | Letter, weekly report, investor update, more |
| Loading | URL, id, intent via catalog | MCP plugin with search/load/validate tools |
| Skill | One `fill-template` skill | Packaged per agent platform |
| Charts | Specs + Markdown table / Mermaid output | Live chart rendering service |
| Web | Repo only | foundrvibe.com/templates page linking to repo |
| Custom templates | Fork the repo | Custom company templates UI |
| Business | Free | Paid plans (TBD) |

---

## 11. Success metrics

| Metric | How we measure | Target |
|---|---|---|
| Repo adoption | GitHub stars, clones, forks | Open question — set after first 30 days of baseline |
| Successful fills | Agent produces a doc that validates against schema, in test runs across ChatGPT, Claude, Cursor | Open question — define test set and pass rate |
| Honest fills | In test runs, zero invented numbers; agent asks for missing required fields | Zero invented numbers in test set |
| Founder feedback (qualitative) | Founders say output matched the structure and the agent asked for missing info | Collect from first users via interviews / GitHub issues |

---

## 12. Open questions

1. **Final product name.** "FoundrVibe Templates" is a working title.
2. **License.** MIT, Apache 2.0, or CC BY for templates?
3. **Placeholder syntax.** Handlebars-style `{{field}}` or something simpler agents handle more reliably?
4. **Intent matching.** Is keyword matching in `catalog.json` enough, or do we need descriptions the agent reasons over?
5. **Where the fill skill lives.** In this repo only, or also published to each agent platform's skill/plugin format?
6. **Context size limit.** What's the max size for template + schema + rules?
7. **Measuring real-world fills.** We can't see agent usage directly from a public repo. How do we measure "agents successfully filling a template" beyond our own tests?
8. **Baseline targets.** No data yet for stars/clones targets. Set after launch.
9. **Market size and competitors.** Not researched yet. Don't put numbers in any pitch until we have sources.
10. **Letter and weekly report.** Ship as stubs in MVP or wait until done?
11. **MCP plugin timing.** What signal triggers building it (usage level, user requests)?
12. **Localization.** English only for MVP? When to add other languages?

---

## 13. Launch plan

### Phase 1: Build (MVP)
- Set up repo structure, `catalog.json`, `rules/fill.md`.
- Ship PRD and business plan templates with schema + example.
- Write the `fill-template` skill.
- Write README with URL / id / intent examples for ChatGPT, Claude, Cursor.
- Add CI to validate examples against schemas.

### Phase 2: Test
- Run each template through ChatGPT, Claude, and Cursor with: complete inputs, missing required fields, missing optional fields, and no numeric data.
- Check: structure matches, agent asks for missing required fields, no invented numbers.
- Fix rules and schemas based on failures.

### Phase 3: Public launch
- Make the repo public.
- Share with a small group of founders first and collect feedback.
- Announce on X and other founder channels (exact channels TBD).

### Phase 4: Follow-up
- Add foundrvibe.com/templates page linking to the repo.
- Finish letter and weekly report templates.
- Decide on MCP plugin based on usage and feedback.

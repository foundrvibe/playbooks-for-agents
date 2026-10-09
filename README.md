# Playbooks

A playbook is a job you already know how to do, written down once. Give that playbook to your agent. The agent does the job the way you would, and respects that pattern on every run.

One skill runs every playbook, in ChatGPT, Claude, or Cursor.

```mermaid
flowchart LR
  job[A job you already know how to do] --> playbook[Written down once as a playbook]
  playbook --> give[Give the playbook to your agent]
  give --> result[The agent does the job the way you would]
```

Three files make that work:

- [rules/fill.md](rules/fill.md) is the contract for every run: cite sources, label estimates, and do not leave a section blank.
- [skills/fill-template/SKILL.md](skills/fill-template/SKILL.md) is the loop: pick the playbook, ask, follow its steps, return the result.
- [catalog.json](catalog.json) is the index. Playbooks sit in categories. **Planning** is the first category, and it contains the business plan. A request is matched to a ready playbook. A stub is skipped. If two ready playbooks both match, the agent asks which one and names the category.

## Use it

Paste this into ChatGPT, Claude, or a Cursor agent chat. One link is enough. The skill fetches the rules, the catalog, and the playbook files.

```text
Follow https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/skills/fill-template/SKILL.md

Create a business plan for ZedCut, a bilingual B2B SaaS for countertop fabrication shops in Canada.
```

Replace the second line with your own request. If several playbooks match, the agent asks which one and names the category.

To choose the playbook yourself, name its id. The agent uses that playbook and does not match intents.

```text
Follow https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/dev/skills/fill-template/SKILL.md

Playbook: business-plan
ZedCut is a bilingual B2B SaaS for countertop fabrication shops in Canada.
```

A raw URL to `template.md`, `schema.json`, or the playbook folder selects it the same way. Replace `dev` with a version tag to pin that playbook.

<details>
<summary>Add a playbook</summary>

1. Copy `playbooks/_starter/` to `playbooks/<category>/<id>/`. Set `x-id` in `schema.json` to the new id.
2. Edit `template.md`, `schema.json`, and `example.json`. `template.md` is the result. Mark each field `x-source` as `user`, `user_data`, `derived`, or `research`.
3. In `research.md`, write `## Steps` in the order a person would do the job. Name every `research` field and link the shared guide as `../../../research/<name>.md`. Add a new shared guide only when none fits.
4. Add a catalog entry with `id`, `name`, `version`, `status`, `category`, `description`, `intents`, and the four file paths. `category` must be an id in `categories`, and that category's `templates` list must include the new id. Create a category when none fits. Set `status` to `ready` and fill `intents` when a request should select it. Leave `intents` empty while it is a stub.
5. Run `npm ci && npm run validate`.

No new skill is required. CI fails if two ready playbooks share an intent, if `research.md` misses `## Steps` or a research field, or if the example does not pass the fill check.

</details>

<details>
<summary>Pin a version</summary>

Each playbook version is tagged as `<id>-v<version>`, for example `business-plan-v4.0.0`. Replace `dev` in any raw URL with the tag to keep a fixed shape:

`https://raw.githubusercontent.com/foundrvibe/playbooks-for-agents/business-plan-v4.0.0/playbooks/planning/business-plan/template.md`

A tag pins the rules and skill at that commit too. A breaking schema change gets a new major version.

</details>

<details>
<summary>Check a fill</summary>

Save the JSON the agent returns, and optionally its Markdown, then run:

```text
npm ci
node scripts/check-fill.mjs business-plan fill.json filled.md
```

It fails when the JSON does not match the schema, the Markdown still has an unknown marker or a placeholder, `sources` is empty in `web` mode, or a number in the Markdown is not in the JSON. Without `filled.md`, it renders the JSON with `scripts/render-fill.mjs` first.

</details>

<details>
<summary>Test contexts</summary>

[tests/contexts/](tests/contexts/) holds real contexts, such as `zedcut.json`. Paste its `context` into each agent, save the fill, and add `--expect tests/contexts/zedcut.json` to the check to compare the fields it lists.

</details>

<details>
<summary>What comes back</summary>

The agent returns only the finished result. Sources are inside that result. The field values stay in the agent's check and are not pasted after it.

</details>

<details>
<summary>Charts</summary>

Charts come from cited figures or from a labeled assumption built from them.

- **Agents that can run Python** (ChatGPT data analysis, Claude code execution, Cursor) draw each chart with [charts/render_chart.py](charts/render_chart.py) and show the PNG, with the same values in a table below it. The colors and size come from [themes/default.json](themes/default.json), so every plan looks the same.
- **Agents that can't run Python** write a Mermaid chart and a table instead.

To draw one yourself:

```text
pip install matplotlib
python charts/render_chart.py --kind mermaid-xy --data '{"seriesName": "Revenue", "x": ["Year 1", "Year 2"], "series": [120000, 260000]}' --currency CAD --language fr --out financials.png
```

</details>

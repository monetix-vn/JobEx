# The people library

The data the people generator draws from (ADR 0003, `docs/design/IDENTITY-ENGINE.md`). Five JSON files:

| File | What it holds |
| ---- | ------------- |
| `archetypes.json` | About a dozen starting points (ambitious climber, tired veteran...): temperament means and spreads, value and quirk affinities, story-function biases, voice tags. They only shift odds; they never fix a person. |
| `quirks.json` | Small habits and mannerisms with weights, tags, incompatible pairs, tiny temperament shifts and voice tags (English and Vietnamese names). |
| `names.json` | Family, middle and given names with weights, and "older" and "younger" leanings so a 55-year-old is more likely a Thị or a Văn than a 24-year-old. |
| `departments.json` | Per department: gender mix, age profile, minimum education, base income. `external` is for spouses and parents. |
| `tables.json` | Real-world data tables, each with its **source**, **year** and a **verified** flag. Education, marriage, children, regions, sex ratio at birth, spouse age gap, hiring paths. |

## Working on it

```bash
pnpm library:edit          # the offline editor at http://127.0.0.1:5180 (edits these files, keeps .bak copies)
pnpm people:validate       # checks every reference, probability row and age coverage (also in CI, strict)
pnpm people:generate --n 300 --department hr     # distributions of a generated group, against the tables
```

The editor's **preview** tab generates people from the unsaved draft and charts the result next to the department
targets, so you see what a change does before saving. It refuses to save a library with errors.

## Rules

- Personality axes are independent of gender and age (a tested fairness rule). Age and gender change life state (dependents, energy, how
  others treat the person), never temperament.
- A table is **verified** only after someone has checked it against the named source and written what they
  checked in `note`. Today only `birth_sex_ratio` is; the rest are approximations and are flagged as such in the editor and
  by `pnpm people:validate`.
- Keep Vietnamese and English for every name that players can see.
- A generated person never exists outside this data: no number is hard-coded in the generator.

# AI guide: start here

JobEx is a simulation game that teaches other jobs by living their pressures, including the dark side
(lobbying, bending rules), for realism. You are continuing work that other sessions started. This
file tells you what to read, where to pick up, and how to behave. It replaces re-reading everything.

## 1. Read in this order (stop when you know enough)

1. `CLAUDE.md`: commands, architecture in 12 lines, rules of thumb.
2. `docs/STATUS.md`: what is done, branches, the ordered next steps.
3. The checklist for your kind of work:
   - Engine / tools / product: `docs/checklists/TECH.md`
   - Story / scenes / events: `docs/checklists/STORY.md`
4. Only then the specific files: the job's bible `docs/story/<job>.md`, `docs/adr/0002-*.md`,
   `content/industry-cookware/events/README.md` (tone + scene rules), `docs/AUTHORING.md` (YAML).

Do not read whole packages or all content. Use `pnpm content:list` and the package READMEs.

## 2. How to pick up work

1. `git status` and `git log --oneline -5`; make sure you are on the right branch (see STATUS).
2. Open the right checklist and take the **first unchecked item** in order, unless the owner said
   otherwise. Items marked `(needs owner)` must be asked about, not guessed.
3. Story work depends on engine work: check the TECH checklist item named in the bible before writing
   arc/character content.
4. Do the item in small steps, run the smallest check (`pnpm check:fast`), then the full
   `pnpm run ci:quiet` before committing (check the exit code).
5. Finish by updating: the checklist box, the bible's episode Status, `docs/STATUS.md`, then commit.
6. Report to the owner (what changed, what needs review, what you need from them).

## 3. The two checklists

- `docs/checklists/TECH.md`: phases 0 to 5. Phase 2 (story engine: characters, relationships, arcs,
  beats) is the current focus and requires the owner's approval of ADR 0002.
- `docs/checklists/STORY.md`: global story items, then per job (QC, Sales, Finance). The
  per-episode tables are in `docs/story/<job>.md`. Order of work for the series: **engine -> series
  bible (owner approves) -> episode list (owner approves) -> scenes -> review and balance**. No scenes
  before an approved bible and episode list.

## 4. Rules you must follow

Game rules (see `events/README.md` for the full list and the tone):

- c1 by the book, c2 legitimate compromise, c3 shortcut. Never reorder.
- Every choice has a cost; probabilities sum to 1; deeds that could be found out create a fact.
- Every text exists in `en` and `vi`, same meaning; Vietnamese is natural, not a literal translation.
- The simulation never reads the locale; the same seed and inputs must give byte-identical logs.
- No real people, companies or laws; no how-to for fraud; no claims of realism (text is a first draft).

Engineering rules:

- Module boundaries are enforced (contracts <- kernel/rules <- mod-* (never each other) <- client-web
  (contracts only) <- tools). Modules talk by events.
- Packages may not use Date, Math.random or browser globals (ESLint).
- Never edit `pins.json` by hand; run `pnpm pin:update` after an intended behaviour change and say so.
- Write files with editor tools, not shell heredocs. Format only changed files (`pnpm format`).
- On this Windows setup run pnpm as `npx -y pnpm@9.15.9 ...` if `pnpm` is not on PATH. No `gh` CLI.

Process rules:

- Do not push or open a PR unless the owner asked. The owner approved pushes branch by branch so far.
- Commit trailer: `Co-Authored-By: Claude <noreply@anthropic.com>` style as in git log.
- Never commit with a failing CI; chain with `&&`, check the exit code.
- Do not put model names in repo files.
- If a decision is the owner's (tone intensity, which job next, ending design), ask once, concisely,
  with a recommendation.

## 5. Useful commands

```bash
pnpm check:fast                    # only what you changed
pnpm run ci:quiet                  # the full CI, one line per step
pnpm content:list [--role qc] [--facts]
pnpm author <file.yml> [--dry-run] # import scenes/facts/terms (EN+VI) and validate
pnpm new:scene <key> [--prefix qc] # scaffold a scene by hand instead
pnpm pin:update                    # after intended behaviour changes
pnpm build:play                    # rebuild JobEx-play.html
```

## 6. Where things live

| What                            | Where                                               |
| ------------------------------- | --------------------------------------------------- |
| Content packs (JSON)            | `content/<pack>/{roles,events,scenes,offers,facts,terms,locale}` |
| Authoring sources (YAML)        | `content-src/`                                      |
| Series bibles                   | `docs/story/`                                       |
| Decisions                       | `docs/adr/`                                         |
| Modules                         | `packages/mod-*`, each with a README                |
| Headless runs and balance tests | `tools/sim-runner`                                  |
| Playable host                   | `tools/demo-host`, `client-web`                     |

## 7. Definition of done for any change

Tests added or updated; CI green; docs updated (checklist, bible Status, STATUS.md, README if a
command changed); committed with a clear message; reported to the owner.

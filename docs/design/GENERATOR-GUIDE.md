# The people generator: a guide and whitepaper

Version 1, 2 October 2026. Written for authors, designers, reviewers and anyone who wants to understand how
JobEx makes people. It is shown inside the library editor (the **Guide** tab) and kept in
`docs/design/GENERATOR-GUIDE.md`. Everything here describes what is built today; planned parts are marked **(planned)**.

## 1. What it is, in one minute

JobEx is a simulation about work, so it needs many believable people: colleagues, bosses, new hires, spouses and children. The people
generator draws them from a **library of data** (archetypes, quirks, names, department profiles and real-world
statistics) with a **seeded random number generator**. Give it the same seed and the same request and you get the same
person, every time. Give it a new seed and you get a different person who still fits the world.

Three ideas hold it together:

1. **Data, not code.** Every number a person is built from lives in `library/*.json`, where you can edit it in the editor.
   The generator hard-codes no statistic.
2. **Everyone is a Person.** The player and every other character share one model, so one set of rules applies to all.
3. **Fairness by construction.** Personality is drawn independently of gender and age. Age and gender change a person's
   *situation* (family, money, energy), never their *character*.

## 2. The Person

A Person has an **origin** (fixed at creation) and a **life state** (changes slowly). Later parts (planned) add memory
(what has happened) and intent (what they want now).

| Part | Fields | Notes |
| ---- | ------ | ----- |
| Origin | gender, age, region, urban or rural, education, how they got the job, **temperament** (6 axes), **values** (2 or 3), **quirks** (2 or 3), archetype, name, voice tags | Never changes. |
| Life state | department, ladder step, tenure, performance, income, debt, savings, marital status, children, dependents, housing, health | Changes yearly or by life events (planned). |
| Family links | spouse, children, parents | Filled in when a household is generated. |
| Appearance **(planned)** | build, height, hair, face, marks and an appearance seed | See section 9. |

**Temperament** has six axes, each 0 to 100: caution, ambition, warmth, integrity, resilience, impulsivity.
**Values** are what a person cares about: security, status, fairness, loyalty, freedom, family, money, craft.
**Quirks** are small habits ("keeps a notebook of everything", "gossips") that colour behaviour and speech.

## 3. The library: five files

| File | What it holds | You edit it to... |
| ---- | ------------- | ----------------- |
| `archetypes.json` | About a dozen starting points: ambitious climber, tired veteran, idealist newcomer... Each gives a mean and spread per temperament axis, affinities for values and quirks, and a bias for story functions. | Make a kind of person more or less common, or change what they are like. |
| `quirks.json` | Habits with a weight, tags, incompatible quirks, tiny temperament shifts and voice tags. | Add texture. A new quirk costs one entry in English and Vietnamese. |
| `names.json` | Family, middle and given names with weights; "older" and "younger" leanings. | Add names or rebalance them. |
| `departments.json` | Per department: share of women, age profile, minimum education, base income. | Change who works where. |
| `tables.json` | Real-world data tables with **source**, **year** and a **verified** flag. | Update numbers once checked against the source. |

### How an archetype works

An archetype does not fix a person; it shifts the odds. Its temperament entries are `[mean, spread]` per axis. For example
`"integrity": [78, 12]` means "usually around 78, plausibly from 54 to 100". Axes it does not mention use `[50, 18]`.
`value_affinity` and `quirk_affinity` multiply the chance of a value or quirk (default 1). `function_bias` multiplies the
archetype's own chance when a story asks for a role (see section 5).

### How a quirk works

`weight` is how common it is. `incompatible_with` lists quirks that never appear together (always list both ways; the
validator warns about one-way pairs). `temperament_shift` nudges the person by a few points. `voice` adds tags that will
later choose how the person speaks.

### How names work

A name is family + middle + given. A few percent have no middle name. `older` and `younger` multiply a name's weight for
people born before or after 1985, so a 55-year-old woman is more likely to be "Thị" and a 24-year-old "Ngọc" or "Khánh".

## 4. How a person is generated

For one request (`department`, optional age range, gender, story function, hiring path, an event id and a counter):

1. **Seed.** The random stream comes from the world seed, the run seed, the event id and the counter. Same inputs, same person.
2. **Gender.** From the department's share of women (a small non-binary share is possible but defaults to 0; there is
   no reliable data for it).
3. **Age.** A normal draw around the department's mean, kept inside its limits and the requested range.
4. **Region and settlement.** From the regional shares and the urban share of the region.
5. **Education.** From the education-by-age table, limited to the department's minimum level and above.
6. **How they got the job.** From the hiring-path table (applied cold, internal transfer, recommended, owner's relative).
7. **Archetype.** A weighted draw. A story function (tempter, whistleblower...) multiplies the weights so the right kind of
   person is more likely, without ever being certain.
8. **Values, quirks, temperament.** Values and quirks are drawn using the archetype's affinities, rejecting incompatible
   quirks. Each temperament axis is a normal draw from the archetype, then nudged by the quirks, then clamped to 0-100.
9. **Life.** Ladder step and tenure from age; income from the department base, step and education; marital status from
   the marriage table for that age and gender; children from the children table; dependents from children and
   supported parents; housing from age and marital status; debt and savings from income, housing and quirks; health from age.
10. **Name and voice.** Family, middle and given names drawn by weight and era; voice tags from the archetype and quirks.
11. **Validation.** A draw that contradicts itself (married at 17, more children than the age allows, tenure longer than a working life,
    repeated quirks...) is **thrown away** and the next sub-seed is tried, up to 24 times. Whatever comes out is valid.

### Households and inheritance

`generateHousehold` builds the people around a person from their own life state:

- A **spouse** if married or partnered: opposite gender (for non-binary people, either), age from the spouse age-gap table.
- **Children** as many as the life state says, with ages that fit the parent, a boy/girl split from the sex ratio at birth,
  the father's family name, and **inherited temperament**: each axis is the parents' average pulled towards 50 (heritability 0.45),
  plus the child's own variation. So two very honest parents have children who are more honest than average, but
  less extreme than themselves.
- Children's **values** favour their parents' values, and a quirk can be inherited.
- **Parents** if the person supports them.

### Money pressure

`moneyPressure` turns life state into a number from 0 (comfortable) to 100 (cornered): debt in months of income,
dependents and savings all count. It is derived, not stored, so it always agrees with the person's money.

## 5. Story functions

A story can ask for "a tempter" or "a whistleblower" without naming anyone. The generator multiplies each archetype's weight by its
`function_bias` for that function. In tests, whistleblowers average more than 12 points higher on integrity than tempters, yet both groups
still contain a range of people. Story functions in the library today: complainant, accused, tempter, rival, mentor,
whistleblower, witness. Add more by adding `function_bias` entries to archetypes.

## 6. The data tables and how to trust them

Every table states its **source** and **year** and has a **verified** flag. **Verified means a person checked the numbers against the named
source and wrote what they checked in `note`.** Today only the sex ratio at birth is verified (111.5 boys per 100 girls, 2019 census,
UNFPA Viet Nam). Several others carry checked anchors in their notes (for example mean age at first marriage 27.2 for men and 23.1 for women, urban share
34.4 percent) but their age-band rows are approximations, and the editor lists them as "not yet verified".

Rules for editing a table:

1. Use a published source. Name it and the year.
2. Probability rows must add up to 1 (the validator checks it) and every age from 18 to 65 must be covered.
3. When you check a table, set `verified` to true and say exactly what you checked in `note`.
4. Where there is no reliable data (non-binary share, misconduct rates), do not invent precision: leave the number at 0 or mark it as a
   prior, and say so.

## 7. Fairness rules

- **Temperament is independent of gender and age.** A test generates thousands of people and fails if men and women differ by more than 2.5
  points on any axis, or if age correlates with integrity.
- **Situation may depend on age and gender**, because real life does: dependents, savings, energy, how others treat a person (planned, as scenes).
- **Bias is shown, not scored.** The simulation never takes points off someone for who they are. Where unfair treatment exists in the game
  (planned), it appears as scenes the player can see and respond to.
- **No quirk is a stereotype.** Quirks describe behaviour ("gossips"), never a group. Reviewers should reject any quirk that reads as a stereotype.

## 8. Using the tools

| Task | How |
| ---- | --- |
| Open the editor | Double-click `library-editor.bat`, or `npx -y pnpm@9.15.9 library:edit`, then open http://127.0.0.1:5180 |
| Check the library | `pnpm people:validate` (also runs in CI, strict) |
| See what it produces | **Preview** tab in the editor, or `pnpm people:generate --n 300 --department hr` |
| Add a quirk | Quirks tab, `+ new quirk`, fill the English and Vietnamese names, set a weight (0.5 rare, 1 normal, 1.5 common), list incompatible quirks in both directions |
| Make a department older | Departments tab, change `age_mean` (and `age_min` or `age_max` if needed), then check the Preview tab |
| Make a kind of person rarer | Archetypes tab, lower its `weight` |

The editor **never** saves a library with errors. Each save keeps a `.bak` copy of the previous files.

### A good editing habit

1. Make one change. 2. Open Preview for the department you care about with 500 or more people. 3. Look at the charts, not just the sample.
4. Read the sample names and quirks for anything odd. 5. Save. 6. Run `pnpm test` before committing.

### Tuning guide

| If you see... | Try... |
| ------------- | ------ |
| One archetype is far too common | Lower its `weight`, or raise others |
| Everyone sounds alike | Add quirks and voice tags; widen archetype spreads a little |
| Too many (or too few) women in a department | Change `female_share` there, not in the generator |
| Ages cluster too tightly | Raise `age_sd` |
| Money pressure looks too high for everyone | Lower debt-related quirk weights; check `income_base_vnd` |
| A quirk never appears | Its `weight` is too low, or it is incompatible with the archetype's favourites |

## 9. What comes next (planned)

- **More data checks** against the statistics office, and a life-events library (marriage, children, illness, loans).
- **Appearance:** traits for body, hair, face and marks drawn from a separate seed, with family resemblance and visible "tells" of stress,
  so sprites can be added later without changing saved worlds.
- **Behaviour:** people acting on each other and on the player from their traits and circumstances.
- **The world:** about 50 people around the player, 500 in the company and 3000 in the world, saved in a world folder that can be continued.
- **Text variety:** a realiser that recombines hand-written text so scenes do not repeat.

The full plan is in `docs/design/WORLD-PLAN.md`; the design reasons are in `docs/design/IDENTITY-ENGINE.md`.

## 10. Questions and limits

**Is it random?** It is *seeded*: it looks random, but the same seed always gives the same result. That is what lets a saved world be continued
and a bug be reproduced.

**Can it make an impossible person?** Not knowingly: every draw is validated, and a contradictory draw is replaced. The validator checks the library
the same way (every reference exists, every probability row adds up).

**Why six temperament axes?** Enough to make recognisably different people, few enough to understand and tune. More can be added later.

**Are the numbers real?** The structure is designed to use real statistics; most tables are approximations waiting for checking (section 6).
The game never claims to be exact; its text is a first draft by an AI and needs practitioner review.

**Who should review the library?** People who know the workplaces and Vietnamese society: HR, line managers, sociologists, and Vietnamese-speaking
reviewers for names and wording.

## 11. Glossary

- **Archetype:** a starting point that shifts the odds of a person's character.
- **Quirk:** a small habit or mannerism.
- **Temperament axis:** one of six personality numbers (0 to 100).
- **Value:** something a person cares about.
- **Story function:** a role a story needs (tempter, whistleblower...).
- **Seed:** the number a random sequence starts from; the same seed gives the same sequence.
- **Verified table:** a data table someone has checked against its named source.
- **Household:** a person plus their spouse, children and supported parents.
- **Heritability:** how strongly children follow their parents' temperament (0.45 here).
- **Money pressure:** a 0-100 summary of debt, dependents and savings.

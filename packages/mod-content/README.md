# @je/mod-content

Owns loading, validating, layering and serving content packs. It contains no game logic and never
reads the file system: packs arrive through a `ContentSourcePort` (bundled files, later a CDN).

Pack layout (per pack folder): `manifest.json`, `locale/{vi,en}.json`, and `roles/`, `events/`,
`scenes/`, `offers/` holding one object (or an array) per JSON file.

`loadContent(source)` returns diagnostics plus, when there are no errors, a `ContentRegistry`.
Checks: JSON parse, JSON Schema per kind, manifest/engine version, dependency and layer order,
duplicate and same-layer conflicts (later layers override earlier ones), reference integrity,
text keys present in both Vietnamese and English, expression validity, outcome probabilities,
and unreachable events or unused scenes (warnings).

Events consumed: `run.started`. Emitted: `content.loaded`.

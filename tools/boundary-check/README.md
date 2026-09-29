# @je/boundary-check

Enforces the dependency rules from the development plan (section 2) in CI. Rules are data in
`src/rules.ts`.

| Layer                 | May import                            | Notes                                              |
| --------------------- | ------------------------------------- | -------------------------------------------------- |
| `contracts`           | nothing                               | no externals                                       |
| `kernel`, `rules`     | `contracts`                           | no externals, no Node built-ins                    |
| `mod-*`               | `contracts`, `kernel`, `rules`        | never another `mod-*`; externals allow-listed      |
| `client-web`          | `contracts`, `kernel`                 | never `mod-*` internals                            |
| `tools/*`             | any package's public API              | Node and npm packages allowed                      |

Also checked: no deep imports (`@je/x/src/...`), no relative imports leaving a package, declared
`package.json` dependencies obey the same rules, every package has `src/index.ts`, a README and
tests, and every `mod-*` exports `manifest` and `createModule` (bundles opt out with
`"je": { "moduleBundle": true }`).

```bash
pnpm check:boundaries
```

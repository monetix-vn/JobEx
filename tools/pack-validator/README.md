# @je/pack-validator

CLI over `@je/mod-content`: validates every pack folder in a content directory (schemas,
reference integrity, Vietnamese and English text keys, expressions, unreachable events).

```bash
pnpm validate:packs                                   # validates ./content
pnpm exec tsx tools/pack-validator/src/cli.ts content --strict --verbose
```

Exit code is 1 on any error (or any warning with `--strict`). A missing translation, an unknown
reference or a broken pack prints the file, the path inside it, and what is wrong.

# @je/demo-host

Composition root for the Phase 0 client shell: creates an in-process `Run` with the stub modules
and connects it to `@je/client-web` through a `Transport`. Vite serves and builds it.

```bash
pnpm dev:web      # http://localhost:5173/?seed=demo
pnpm build:web
```

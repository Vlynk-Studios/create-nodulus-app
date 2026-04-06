# create-nodulus-app

The official scaffolding CLI for [Nodulus](https://github.com/yourorg/nodulus-core) — generate a fully-configured Express + Nodulus project in seconds.

> **Node.js ≥ 20.6** · **ESM Only** · **TypeScript or JavaScript**

---

## Usage

```bash
npx create-nodulus-app
```

No global install required. The CLI will prompt you for a project name and your preferred language, then generate a ready-to-use project.

---

## Interactive prompts

```
┌  create-nodulus-app v1.0.1
│
◇  What is the name of your project?
│  my-api
│
◇  Pick a language
│  ● TypeScript (recommended)
│  ○ JavaScript
│
◇  Project generated successfully!
│
└  Next steps:
   cd my-api
   npm install
   npm run dev
```

---

## Generated project structure

### TypeScript

```
my-api/
├── nodulus.config.ts          ← framework configuration
├── tsconfig.json
├── package.json
├── .gitignore
├── README.md
└── src/
    ├── app.ts                 ← entry point
    └── modules/
        └── users/
            ├── index.ts       ← module declaration
            ├── users.routes.ts
            └── users.service.ts
```

### JavaScript

```
my-api/
├── nodulus.config.js          ← framework configuration
├── package.json
├── .gitignore
├── README.md
└── src/
    ├── app.js                 ← entry point
    └── modules/
        └── users/
            ├── index.js       ← module declaration
            ├── users.routes.js
            └── users.service.js
```

---

## Generated scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `npx tsx --watch src/app.ts` | Development server with hot reload (TS) |
| `npm start` | `node src/app.js` | Production start (JS) |

---

## Requirements

| | Minimum |
|---|---|
| Node.js | **20.6.0** |
| npm | 7+ |

> **Why 20.6?** Nodulus uses the Node.js ESM Hooks API (`--import` / `register`) for runtime alias resolution. This API requires Node 20.6+.

---

## ESM Only

Nodulus is a **pure ESM** framework. All generated projects include `"type": "module"` in their `package.json`. CommonJS (`require()`) is not supported.

```json
{
  "type": "module"
}
```

> Removing `"type": "module"` from your generated project will cause Nodulus to throw `INVALID_ESM_ENV` at startup.

---

## What gets configured

The generated project comes pre-wired with:

- **`nodulus.config.ts`** (or `.js`) — sets `modules`, `prefix`, and `strict` mode out of the box
- **`src/app.ts`** — bootstraps Express + Nodulus with `createApp()`
- **`src/modules/users/`** — a working example module with a controller, service, and correct `Module()` declaration
- **`tsconfig.json`** (TypeScript only) — `NodeNext` module resolution, `ES2022` target, strict mode

---

## Project name rules

The CLI enforces npm-compatible naming:

- Lowercase letters, numbers, and hyphens only
- No spaces, underscores, or special characters

```
✓  my-api
✓  users-service-v2
✗  MyApi         (uppercase)
✗  my_api        (underscores)
✗  my api        (spaces)
```

---

## License

MIT

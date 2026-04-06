# Changelog

All notable changes to `create-nodulus-app` will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.0.0] - 2026-04-06

### Added
- Initial release of `create-nodulus-app`.
- Interactive CLI prompts for project name and language selection (TypeScript / JavaScript) via `@clack/prompts`.
- Flexible project generator with recursive template copying and `{{variable}}` interpolation.
- **TypeScript Template**:
  - `nodulus.config.ts`, `tsconfig.json`, `src/app.ts`.
  - Automated `tsx` integration for Node 20.6+ compatibility.
  - Working `users` module example with documented export contracts.
- **JavaScript Template**:
  - `nodulus.config.js`, `src/app.js`.
  - Working `users` module example with explicit ESM requirement warnings.
- Automatic renaming of `.template` files and `gitignore.template` → `.gitignore`.
- Explicit `engines` requirement (Node >= 20.6.0) in generated projects.
- Guard against overwriting existing directories.
- Full unit test suite for prompts validation and project generator (8 tests).

### Stability & DX Fixes (Included in 1.0.0)
- **Node.js Compatibility**: Replaced experimental Node flags with `tsx` in TS templates to support Node 20.6+ without runtime failures.
- **Documentation**: Added JSDoc comments to generated module indexes explaining the `exports` array vs re-export requirement.
- **ESM Safety**: Added prominent warnings in JS templates about the mandatory `"type": "module"` field.

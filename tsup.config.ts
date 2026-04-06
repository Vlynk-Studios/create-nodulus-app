import { defineConfig } from "tsup";
import { cpSync } from "node:fs";
import { join } from "node:path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false,
  sourcemap: false,
  clean: true,
  target: 'node20',
  banner: { js: '#!/usr/bin/env node' },
  async onSuccess() {
    // Copy templates from src to dist after a successful build
    cpSync(
      join(process.cwd(), "src/templates"),
      join(process.cwd(), "dist/templates"),
      { recursive: true },
    );
    console.log("Templates copied to dist/templates");
  },
});

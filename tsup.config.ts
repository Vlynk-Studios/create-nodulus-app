import { defineConfig } from "tsup";
import { cpSync } from "node:fs";
import { join } from "node:path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  bundle: true,
  async onSuccess() {
    // Copiar templates de src a dist después de una compilación exitosa
    cpSync(
      join(process.cwd(), "src/templates"),
      join(process.cwd(), "dist/templates"),
      { recursive: true },
    );
    console.log("Templates copied to dist/templates");
  },
});

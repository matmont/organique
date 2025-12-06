import { defineConfig } from "tsdown";

export default defineConfig({
  name: "organique",
  entry: ["./src/index.ts"],
  copy: ["src/assets"],
  minify: true,
  treeshake: true,
});

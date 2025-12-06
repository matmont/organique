import { defineConfig } from "tsdown";

export default defineConfig({
  name: "organique-dev",
  entry: ["./src/index.ts"],
  treeshake: true,
  copy: ["src/assets"],
});

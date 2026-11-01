import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local Claude skill scripts are tooling, not app code.
    ".claude/**",
    // One-off build scripts run with node (CommonJS, using Playwright), not part of the app.
    "scripts/**/*.cjs",
  ]),
]);

export default eslintConfig;

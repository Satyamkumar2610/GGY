import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // React Bits components, kept as published so registry updates drop in.
  // They mirror their latest props into refs during render on purpose.
  {
    files: ["components/{BorderGlow,DepthCarousel,HoloCard,TiltedCard}.jsx"],
    rules: { "react-hooks/refs": "off", "@next/next/no-img-element": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local Claude skill scripts are tooling, not app code.
    ".claude/**",
  ]),
]);

export default eslintConfig;

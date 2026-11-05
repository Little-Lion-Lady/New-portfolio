import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Image guardrails (see docs/images.md). Both rules ship with
  // eslint-config-next as warnings; here they fail the lint.
  {
    rules: {
      // Every photo goes through next/image (or GlassImage, which wraps it).
      "@next/next/no-img-element": "error",
      // Alt is required on <img>, next/image and GlassImage alike. Use alt=""
      // for a purely decorative image.
      "jsx-a11y/alt-text": ["error", { elements: ["img", "object", "area", 'input[type="image"]'], img: ["Image", "GlassImage"] }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

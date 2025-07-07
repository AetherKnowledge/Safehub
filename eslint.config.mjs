import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["app/generated/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Allow 'any' type with a warning     
      "@typescript-eslint/no-unused-vars": "warn", // Allow unused variables with a warning
      "@typescript-eslint/no-unused-expressions": "warn", // Disable empty function rule
    },
  },
];

export default eslintConfig;

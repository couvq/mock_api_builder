// Fast pre-commit checks on staged files. The full, authoritative gate
// (prettier, lint, typecheck, tests + coverage, build) runs in CI.
//
// Each code glob formats the staged files and then lints the owning
// workspace with its own linter. Globs are non-overlapping so lint-staged's
// parallel tasks never fight over the same file.
export default {
  // Client: format staged files, then lint the package (eslint).
  "apps/client/**/*.{ts,tsx,js,jsx,mjs,cjs}": (files) => [
    `prettier --write ${files.join(" ")}`,
    "pnpm --filter client lint",
  ],
  // Server: format staged files, then lint the package (oxlint).
  "apps/server/**/*.{ts,js,mjs,cjs}": (files) => [
    `prettier --write ${files.join(" ")}`,
    "pnpm --filter server lint",
  ],
  // Schema package has no linter; just format.
  "packages/schema/**/*.{ts,js,mjs,cjs}": "prettier --write",
  // Everything else prettier understands (docs, config, root scripts).
  "**/*.{json,md,yml,yaml,css,html}": "prettier --write",
};

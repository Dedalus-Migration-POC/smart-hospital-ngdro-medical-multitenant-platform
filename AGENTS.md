# Agent Guide

## Scope

- These instructions apply only to `medical-multitenant-platform`: Angular 21, NgRx, standalone components, SCSS and Vitest.
- `Web-App-Mondino` is a separate legacy application. Use it as a reference only when requested; do not copy its Angular 15 APIs, Karma tests, dependency flags or build scripts into this project.
- Preserve user edits and keep changes within the requested feature. Re-read files when the user has changed them between turns.

## Commands And Validation

Run commands from this repository root; see [package.json](package.json) and [angular.json](angular.json) for scripts and configurations.

- Use npm. Check dependency conflicts before changing versions or adopting installation flags from the legacy project.
- Patient app: `npm start`; admin: `npm run start:admin` (port 4201).
- Production build: `npm run build`; this also runs the `postbuild` hook.
- Focused, non-watching tests: `node node_modules/@angular/cli/bin/ng.js test --watch=false --include '**/path/to/component.spec.ts'`.
- Angular template/type check on Windows PowerShell: `& .\node_modules\.bin\ngc.cmd -p tsconfig.app.json --noEmit`.
- Prefer direct Angular CLI invocation for scoped tests: npm argument forwarding has previously dropped test flags and started the full suite in watch mode.
- Validate the touched behavior first. Report unrelated failures separately; do not change application mock flags just to make HTTP tests pass.
- If the editor reports an unknown component import but Angular compilation succeeds, investigate the Language Service/cache before modifying valid component metadata.

## Architecture

- Keep patient and admin entry points separate: [main.ts](src/main.ts), [main.admin.ts](src/main.admin.ts), [app.config.ts](src/app/app.config.ts), [admin.config.ts](src/app/admin/admin.config.ts).
- Keep HTTP calls in the owning feature service and request orchestration in effects. Follow the neighboring feature's naming and state layout rather than inventing a new pattern.
- Register new feature reducers/effects in [reducers.ts](src/app/store/reducers.ts) and [effects.ts](src/app/store/effects.ts); do not automatically copy patient-app providers into admin.
- Separate loading, success and error state for separate requests; multi-step workflows must distinguish a successful intermediate step from completed authentication or booking.

## Tenant Configuration And UI

- Before hardcoding page content, inspect [PageConfigService](src/app/pages/page-config.service.ts) and the matching configuration under [default](src/assets/json-config/default/) and [cms](src/assets/json-config/cms/).
- Preserve the JSON-driven page patterns: use configured `DYNAMIC_FORM` fields and configured cards where neighboring pages do. Keep display mappings and localized copy in configuration when that is the existing pattern.
- Reuse [shared components](src/app/components/), especially inputs, cards, modals, dynamic forms, spinners and countdowns. Check their actual input/output contracts before creating another implementation.
- Keep Bootstrap Italia/design-angular-kit styling, existing typography and responsive layout. Respect the style budgets in [angular.json](angular.json).
- Update [Italian](src/assets/i18n/it.json) and [English](src/assets/i18n/en.json) labels together; JSON page configuration may instead contain localized text objects.
- Preserve accessible label/input associations, unique IDs and matching visible/accessible names. Verify the rendered DOM before treating an accessibility report as a false positive.
- For UI changes, check desktop/mobile layout and the affected loading/error/success states. Use synthetic data or browser-only request mocks rather than real credentials.

## Existing Documentation

- Follow [the cookie configuration manual](docs/cookie-config-manuale.md) for cookie banners, policy links and related tenant configuration; do not duplicate it in agent instructions.
- Consult [README.md](README.md) for general CLI usage, but use the actual npm scripts above for the proxy and admin workflows.

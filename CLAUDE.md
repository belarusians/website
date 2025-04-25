# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands
- Development: `npm run dev` (with inspect) or `npm run dev:turbo` (turbo mode)
- Build: `npm run build` or `npm run build:profile` (with profiling)
- Lint: `npm run lint` or `npm run lint:fix` (to fix issues)
- Type check: `npm run typecheck`
- Test: `npm run test` 
- Run single test: `npx jest -t "test name pattern"`

## Code Style Guidelines
- TypeScript: Strict mode enabled with ES2017 target
- Path aliases: `@/*` maps to `./src/*`
- React components: Use TypeScript for type definitions
- Formatting: Prettier with 120 char width, single quotes, 2-space indentation
- Naming: camelCase for variables/functions, PascalCase for components/types
- Error handling: Use TypeScript's type system to prevent errors
- Testing: Jest with `__tests__` directories, `.test.ts` file extension
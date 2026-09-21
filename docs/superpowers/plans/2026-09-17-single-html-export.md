# Demo Single HTML Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate one offline, dependency-free HTML file containing the complete built Demo.

**Architecture:** Run the existing Vite build, then parse its generated HTML and inline every local JavaScript and CSS asset. Validate the final document has no remaining local asset references before writing the deliverable.

**Tech Stack:** Node.js ES modules, Vite, Vitest, Vue 3

**Spec:** `docs/superpowers/specs/2026-09-17-single-html-export-design.md`

## Global Constraints

- Output name: `信扬供应链服务平台-Demo.html`.
- No runtime dependency on `dist/assets`, Node.js, a web server, CDN, or network access.
- The exported file must work from a `file://` URL.

---

### Task 1: Single-file bundler

**Files:**
- Create: `apps/portal/scripts/build-single-html.mjs`
- Create: `apps/portal/src/__tests__/single-html-export.test.ts`
- Modify: `apps/portal/package.json`

**Interfaces:**
- Consumes: Vite output at `apps/portal/dist/index.html` and `apps/portal/dist/assets/*`.
- Produces: `inlineBuiltHtml(html: string, readAsset: (path: string) => string): string` and root deliverable `信扬供应链服务平台-Demo.html`.

- [ ] Write a failing Vitest test using sample HTML with one stylesheet, one module script, and one favicon.
- [ ] Run `npm test -- --run src/__tests__/single-html-export.test.ts` and verify it fails because the module is absent.
- [ ] Implement resource inlining, closing-script escaping, favicon removal, and dependency validation.
- [ ] Add `build:single` as `npm run build && node scripts/build-single-html.mjs`.
- [ ] Run the focused test and verify it passes.

### Task 2: Build and offline verification

**Files:**
- Create: `信扬供应链服务平台-Demo.html`

**Interfaces:**
- Consumes: `npm run build:single`.
- Produces: the user-facing standalone HTML deliverable.

- [ ] Run `npm run build:single` from `apps/portal`.
- [ ] Search the output for local `.js`, `.css`, `/assets/`, and favicon references; expect none.
- [ ] Open the absolute `file://` URL in a browser and verify the home page and a secondary page render.
- [ ] Run `npm test` and `npm run build` as final regression verification.

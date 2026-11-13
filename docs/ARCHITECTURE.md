# Architecture

## Prototype scope

Metis Browser currently uses Electron with a bundled Chromium engine. The application is split into a privileged main process, an isolated toolbar renderer, and a separate browsing view.

- `src/main.js` creates the window, controls navigation, and configures denied-by-default permission requests.
- `src/preload.js` exposes only narrowly scoped navigation commands to the toolbar.
- `src/ui.js` implements the address bar and navigation controls.
- `src/security.js` validates top-level navigation schemes and rejects embedded credentials.
- `tests/security.test.js` exercises URL validation.

## Security boundaries

The toolbar uses context isolation, sandboxing, and disabled Node integration. Remote pages are displayed in a separate `WebContentsView` with the same baseline settings. The toolbar does not load remote content.

The browsing session currently uses an in-memory partition for prototyping. This is not a private browsing guarantee.

## Future milestones

1. Add automated desktop smoke tests.
2. Add download and navigation error UX.
3. Implement explicit per-site permissions and policy tests.
4. Evaluate tracker protection and upstream security maintenance.
5. Establish signed builds, a supported platform matrix, and release update procedures.

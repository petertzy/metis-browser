# Toolbar IPC Security

## Purpose

The trusted toolbar uses Electron IPC to request navigation and browser commands. Untrusted web pages run in a separate `WebContentsView` and must not gain control of browser-level operations.

## Sender verification

Both `browser:navigate` and `browser:command` require the IPC sender to be the toolbar `webContents` **and** the sender frame to be its main frame. A matching `webContents` alone is insufficient because embedded child frames can share a sender.

The helper is covered by unit tests for authorized, child-frame, unrelated, missing-frame, and destroyed-toolbar cases.

## Verification

```sh
npm run check
```

The cross-platform CI runs the unit tests on Windows, Linux, and macOS. The Linux desktop smoke test validates that the application starts, but it does not exercise hostile iframe injection or constitute a security audit.

## Remaining risks

- A compromise of the trusted toolbar main frame could still invoke the exposed commands.
- This change does not implement tracker blocking, phishing protection, or site isolation guarantees.
- Electron and dependency vulnerabilities must be reviewed separately before any release.

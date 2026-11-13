# Metis Browser

**Wisdom Is Your First Defense.**

Metis Browser is an **experimental Electron-based desktop browser prototype**. This repository currently contains source code, not a supported installer or production-ready browser.

## Requirements

- Git
- Node.js 20 or newer and npm
- Windows, macOS, or Linux desktop environment
- Internet access for dependency installation and browsing

The automated desktop smoke test currently runs on Linux. Other desktop platforms have not been verified by the project's CI.

## Download and run

Open a terminal and run:

```sh
git clone https://github.com/petertzy/metis-browser.git
cd metis-browser
npm install
npm start
```

The application should open a window with a navigation toolbar and a web page. The initial home page is `https://example.com/`.

**Linux note:** Chromium's sandbox must work for Electron to start. If startup reports a `chrome-sandbox` ownership or permissions error, consult the Electron sandbox documentation and your Linux distribution's guidance. Do **not** use `--no-sandbox` as a workaround.

## Use the browser

1. Type a website address, such as `https://example.com` or `example.com`, into the address field and press **Enter**.
2. Use **Back** (←) and **Forward** (→) to navigate browsing history.
3. Use **Reload** (↻) to refresh the current page.
4. Use **Home** (⌂) to return to `https://example.com/`.
5. Read the status indicator for `Loading`, `Ready`, or `Invalid or failed`.

Only HTTP and HTTPS destinations are supported. This prototype is not a search engine: entering search keywords does not perform a web search.

## What works and what does not

| Capability | Current status |
| --- | --- |
| Open HTTP(S) websites | Experimental |
| Address bar, back, forward, reload, home | Implemented |
| Sandboxed browsing view and isolated toolbar | Configured; not independently audited |
| Website permission requests | Denied by default |
| Downloads | Blocked |
| New windows and popups | Blocked |
| Extensions | Not implemented |
| Tracking or phishing protection | Not implemented |
| Multiple tabs and bookmarks | Not implemented |
| Production installers and automatic updates | Not available |

Do not use this prototype for banking, sensitive accounts, or other security-critical browsing. A passing CI test does not establish browser security.

## Run tests

```sh
npm run check
```

This runs JavaScript syntax checks and unit tests. For unit tests alone:

```sh
npm test
```

On a Linux desktop with a working graphical environment, run the optional toolbar startup smoke check:

```sh
METIS_SMOKE_TEST=1 npm start
```

The smoke mode exits automatically after checking the toolbar and preload bridge. CI runs a similar check under Xvfb. See [Testing and dependency review](docs/TESTING.md).

## Known security and development limitations

- The dependency audit has reported **two high-severity findings**; they are not yet triaged or fixed.
- The repository does not yet commit a reviewed dependency lockfile.
- The Electron prototype is **not** a native Chromium fork.
- The planned Metis Shield, Metis Privacy, and Metis Extensions systems are not finished browser features.

Do not distribute this prototype as a secure release. See [Security policy](SECURITY.md), [Threat model](docs/THREAT_MODEL.md), and [Upstream policy](docs/UPSTREAM_POLICY.md).

## Development and contribution

Review [Architecture](docs/ARCHITECTURE.md), [Kiwi architecture reference](docs/KIWI_REFERENCE.md), and [Contributing](CONTRIBUTING.md) before changing browser internals. Open a GitHub issue or pull request with reproducible steps and tests where appropriate.

Project name: **Metis Browser**. Motto: **Wisdom Is Your First Defense.**

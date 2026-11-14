# DuckDuckGo-Inspired Desktop Browser Roadmap

## Goal

Build a privacy-focused desktop browser with feature goals informed by DuckDuckGo's public projects, supporting **Windows, Linux, and macOS**. Metis is an independent project, not an official DuckDuckGo product or a line-for-line port.

## Public references

- [DuckDuckGo Apple browsers](https://github.com/duckduckgo/apple-browsers): desktop browser navigation, privacy controls, and user experience reference.
- [DuckDuckGo privacy extension](https://github.com/duckduckgo/duckduckgo-privacy-extension): tracking-protection feature reference.
- [DuckDuckGo content-scope scripts](https://github.com/duckduckgo/content-scope-scripts): web-content privacy protection reference.
- [DuckDuckGo privacy test pages](https://github.com/duckduckgo/privacy-test-pages): inspiration for behavioral regression tests.

Review upstream licenses and attribution requirements before reusing any external source. Prefer independent implementation and tests. Do not copy logos, branding, or protected assets.

## Delivery gates

| Area | Baseline | Next engineering gate |
| --- | --- | --- |
| Windows | Source checks via GitHub Actions | Native application launch, packaging, and signed installer verification |
| Linux | Source checks and Xvfb startup smoke test | Tested packaging, sandbox hardening, and distribution-specific checks |
| macOS | Source checks via GitHub Actions | Native application launch, notarization/signing plan, and packaging |
| Privacy | Default-deny website permissions and downloads | Verified tracker blocking, storage partitioning, and privacy tests |
| Browser experience | Basic navigation toolbar | Tabs, history, bookmarks, downloads policy, and privacy controls |
| Supply chain | Informational npm audit | Reviewed lockfile, reproducible installs, and blocking vulnerability policy |

## Security requirements

1. Keep Chromium/Electron versions updated and monitor vulnerability advisories.
2. Preserve Chromium sandboxing, context isolation, and strict IPC boundaries.
3. Require explicit approval for any website capability that could expose sensitive data.
4. Validate navigation and redirect destinations; reject dangerous internal schemes.
5. Build automated, platform-specific regression checks before describing a feature as supported.
6. Treat security test results as evidence of specific properties, not as a blanket security certification.

## Review workflow

Use a new branch based on current `main` for each bounded change. Open a draft PR targeting `main`, include tests and practical English instructions, and wait for human review before merging.

The project must contain **English-only** source, comments, UI text, documentation, commits, and PR descriptions.

# Chromium Architecture Research

## Sources

- [Kiwi Browser source](https://github.com/kiwibrowser/src) (archived; default branch `master`)
- [Kiwi Browser Next](https://github.com/kiwibrowser/src.next) (default branch `kiwi`)
- [Chromium](https://chromium.googlesource.com/chromium/src/)

These repositories are used as **architectural references**, not as an unreviewed source drop.

## Verified findings

Kiwi's original repository contains a Chromium source tree, including GN build configuration, Android browser integration and extension support. Its README describes extension support, bottom address bar, night mode, and Android build instructions.

Kiwi Next separates Chromium-related changes into directories such as `chrome`, `content`, `extensions`, `net`, `components`, and `services`. Its `fetch_from_upstream.sh` currently contains only `git fetch && git pull --rebase`; this is not a complete automated security-update or conflict-resolution system.

The inspected Kiwi Next `CHROMIUM_VERSION` file contains 105.0.5195.24. The project README states that Kiwi Browser would no longer be maintained after January 2025. Neither repository should be treated as a supported security-update channel for Metis.

Licensing requires care: Kiwi Next has a BSD-3-Clause license, and the original Kiwi source includes Chromium-derived license and attribution requirements. Any reused code must retain relevant copyright notices and third-party licenses. Metis's existing MIT license does not supersede upstream requirements.

## Proposed Metis architecture

```text
metis-browser/
  browser/               Browser UI and lifecycle policies
  privacy/               Tracking protection and storage policies
  security/              Permission, navigation and download protections
  extensions/            Extension policy and compatibility layer
  integrations/          Upstream Chromium integration and patch inventory
  docs/                  Threat model, design and update policy
  tests/                 Regression and integration tests
```

The directories above describe a **target layout**, not existing implementation.

### Architectural decisions

1. **Upstream first.** Track a supported Chromium release channel rather than inheriting an abandoned fork's engine version.
2. **Small, auditable delta.** Keep Metis-owned changes as clearly identified patches/modules with upstream revision metadata.
3. **Security before features.** Preserve Chromium sandbox and site isolation; require threat modeling and tests for any change to privilege boundaries.
4. **Extensions are a high-risk interface.** Investigate Kiwi's integration design, but implement a permission-reviewed, testable policy layer instead of importing legacy extension changes wholesale.
5. **Privacy with explicit trade-offs.** Explore network partitioning, tracker controls and per-site permissions while documenting breakage and limitations.
6. **Build provenance.** Plan reproducible build metadata, dependency inventories, signed releases, and CI checks for vulnerability advisories.
7. **Android focus needs platform-specific research.** Kiwi's source is Android-centric; Electron desktop code is a separate experimental track, not an Android Chromium fork.

## Milestones

- **M0 - Reference review:** Record architecture, repository status, copyright and license requirements, and threat-model assumptions.
- **M1 - Platform decision:** Determine supported OS and Chromium integration strategy; pin a currently supported upstream release.
- **M2 - Minimal native browser:** Establish build instructions and a browser shell with a tested security baseline.
- **M3 - Privacy model:** Implement and test storage isolation and permission controls.
- **M4 - Extension evaluation:** Prototype extension lifecycle and permissions only after isolation tests.
- **M5 - Security operations:** Add upstream release monitoring, automated patch review, fuzzing targets, and signed artifact policies.

## Non-goals

- Claiming that old Kiwi sources are currently security supported.
- Copying large upstream source trees into Metis before reviewing license and maintenance implications.
- Disabling browser sandboxing or site isolation for extension compatibility.
- Presenting the Electron prototype as a production-ready secure browser.

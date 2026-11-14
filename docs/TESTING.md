# Testing and Dependency Review

## Unit tests

Run `npm install` and `npm run check`. Tests exercise navigation validation, permission defaults, and upstream version parsing.

## Cross-platform source checks

The [Cross-Platform Checks workflow](../.github/workflows/cross-platform.yml) runs JavaScript syntax checks and unit tests on GitHub-hosted Windows, Linux, and macOS runners. It installs dependencies with postinstall scripts disabled to avoid unnecessary Electron binary downloads in source-only checks.

**These are not native browser launch or installer tests on Windows and macOS.** Do not claim full platform support from this workflow alone.

## Desktop smoke test

The Linux desktop smoke workflow starts the actual Electron process under Xvfb and verifies that the toolbar and preload bridge initialize. The application exits with a nonzero code when this check fails.

Run locally on Linux with a graphical environment:

```sh
npm install
METIS_SMOKE_TEST=1 npm start
```

The smoke test is not a full end-to-end security test. It does not prove sandbox correctness, site isolation, permission enforcement, or protection against malicious content.

## Dependency audit

The dependency audit workflow generates a temporary npm lockfile and uploads both the audit JSON and lockfile as artifacts. The report is informational and does not currently fail the build when vulnerabilities are found.

**A generated lockfile is not the same as a committed, reviewed dependency lockfile.** The resolved dependency graph can change between runs. Before a release, commit a reviewed lockfile, use `npm ci`, and make critical/high severity findings a release-blocking condition after triage.

Scheduled workflows only execute from the repository default branch. Review the findings manually before making any security or release claims.

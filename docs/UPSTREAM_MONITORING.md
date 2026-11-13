# Upstream Monitoring

## Purpose

Metis needs a repeatable way to detect upstream browser-engine releases. The initial monitoring workflow checks the latest published Electron release and the current Chrome Linux stable version from Google's version history API.

## Operation

The `Upstream Monitor` workflow runs weekly and can be started manually. Its output is a GitHub Actions step summary; it does not automatically update dependencies, open issues, or claim that the browser is patched.

The workflow uses:

- https://versionhistory.googleapis.com/v1/chrome/platforms/linux/channels/stable/versions?pageSize=1
- https://api.github.com/repos/electron/electron/releases/latest

Run locally with `node scripts/check-upstream.js`. Internet access is required. Tests use fixtures and do not require internet access.

## Important limitations

- Electron's embedded Chromium version is not necessarily equal to the current Chrome stable version.
- The configured Electron semver range does not reveal the actual installed version without a lockfile.
- A new version is not proof that all known vulnerabilities are fixed.
- The native Chromium integration has not been selected or built.
- Scheduled GitHub Actions workflows normally run from the default branch; this workflow will not run on a schedule until merged into the default branch.

## Release requirements

Before releasing binaries, pin resolved dependencies, record the exact Electron and Chromium revisions, assess security advisories, and run desktop smoke tests.

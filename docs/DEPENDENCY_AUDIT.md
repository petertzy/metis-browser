# Dependency Audit Gate

The dependency audit workflow resolves the current dependency graph and
runs `npm audit --json`. It uploads the report and generated lockfile as
short-lived artifacts for review. A separate severity gate fails the audit
job if the report includes critical or high findings, or if the report
cannot be parsed or lacks required severity counts.

The Electron development dependency is upgraded to the patched 45.x line
to address the reported Electron and extract-zip high-severity advisories.
This is a major-version upgrade and requires runtime compatibility testing.
The audit gate is detection, not a substitute for ongoing remediation.
The repository does not
yet commit a reviewed lockfile, so resolution may vary across runs.
An npm audit report also does not cover every runtime security risk,
Electron/Chromium exploit, or malicious package behavior.

## Local reproduction

Run:

```sh
npm install --package-lock-only --ignore-scripts
npm audit --json > npm-audit.json
node scripts/check-audit.js npm-audit.json
```

`npm audit` can exit nonzero when vulnerabilities exist. Inspect the JSON
report and the gate result rather than treating the audit command's exit
code alone as proof of coverage.

Before a release, commit and review a lockfile, use `npm ci`, triage
critical/high findings, and verify fixes across supported platforms.
Never suppress findings without documenting the reason and residual risk.

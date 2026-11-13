# Metis Browser Threat Model (Draft)

## Status

This is a planning document for an experimental prototype. It is not a security certification.

## Assets

- User credentials, cookies, tokens, and browsing history
- Local files and operating system resources
- Web origin boundaries and permissions
- Browser updates and build artifacts
- Extension capabilities and stored data

## Adversaries

- Malicious or compromised websites
- Malicious browser extensions
- Network attackers able to tamper with unencrypted traffic
- Compromised dependencies or release infrastructure
- Local unprivileged processes

## Trust boundaries

1. **Website to browser process:** Untrusted page content must not gain privileged APIs.
2. **Origin to origin:** Site isolation and web security must remain enabled.
3. **Extension to browser:** Extension permissions require explicit scoping and review.
4. **Network to browser:** Remote content is untrusted, including redirects and downloads.
5. **Build to installation:** Dependencies and distributed binaries require provenance and integrity checks.

## Existing experimental controls

- Sandboxed remote browsing view and isolated toolbar renderer
- Disabled Node.js integration in renderers
- Denied-by-default website permission requests
- Denied popup creation
- HTTP(S)-only top-level navigation validation

These controls are incomplete and have not been independently audited.

## Known gaps

- No production release/update system or pinned, reviewed dependency lockfile
- No verified phishing, malware, or tracker blocking
- No browser-level download policy or safe-browsing integration
- No automated end-to-end security tests
- No verified native Chromium patch maintenance process
- No formal extension permission model
- No assurance against Chromium zero-day exploits

## Security invariants for future changes

- Never disable sandboxing, context isolation, or web security for convenience.
- Do not expose raw Electron IPC or Node.js APIs to untrusted content.
- Treat navigation and redirect targets as untrusted inputs.
- Review new permissions and cross-origin communication as security-sensitive changes.
- Pin and update supported browser engine versions; do not ship an obsolete Chromium fork.

## Review process

Any change crossing a trust boundary should document its threat, mitigations, negative tests, and residual risks. A release must not be described as secure or production-ready solely because unit tests pass.

# Security Policy

Metis Browser is an **experimental prototype**, not a hardened browser. Do not use it for sensitive accounts, payments, or high-risk browsing.

## Reporting vulnerabilities

Please do not publish exploit details in a public issue. Contact the repository maintainers privately using GitHub's private vulnerability reporting feature if enabled. If it is not enabled, request a private reporting channel without disclosing the vulnerability details.

## Current limitations

- The browser depends on Electron and its bundled Chromium version; keeping dependencies patched is essential.
- This prototype does not provide comprehensive tracker blocking, phishing detection, extension support, hardened site isolation, or audited sandbox guarantees.
- Website permission requests are denied by default, and unexpected pop-up windows are blocked.
- Only HTTP and HTTPS navigation are accepted by the address bar.
- No claim of anonymity, complete tracking prevention, or protection from all attacks is made.

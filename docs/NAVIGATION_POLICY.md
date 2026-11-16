# Navigation Guard

The browsing view only permits HTTP and HTTPS navigations. The toolbar
validates typed destinations, while the browsing view independently checks
main-frame navigations, redirects, and subframe navigations before they
commit. This prevents an embedded frame from bypassing the top-level
navigation guard through a non-web scheme.

The guard rejects URLs containing credentials, control characters, or
unsupported schemes. It does not inspect every network resource request,
and it does not provide phishing, malware, tracking, or private-network
protection. Blocking non-web frame navigations may affect sites that rely
on special embedded documents.

## Verification

Run `npm run check` to exercise the navigation event handlers with
mocked Electron webContents events. The cross-platform source checks run
these tests on Windows, Linux, and macOS. A real Electron integration
test with malicious frame navigation is still needed before treating
this boundary as validated.

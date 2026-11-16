# Device Permission Policy

The Metis prototype uses an ephemeral browsing session and denies privileged website permissions. Electron has a separate device-permission decision path for hardware access, so the browsing session also installs `setDevicePermissionHandler(() => false)` to reject device access, including USB, HID, and serial devices.

This defense is separate from `setPermissionRequestHandler` and `setPermissionCheckHandler`. The session also continues to block downloads until a user-facing approval and safe destination policy exists.

## Test

Run `npm run check` to exercise mocked session handlers and verify that permission requests, checks, device grants, and downloads are denied. The GitHub Actions cross-platform source-check matrix runs these unit tests on Windows, Linux, and macOS.

## Limitations

The unit tests verify handler registration and decisions, not malicious device behavior against a running Electron instance. This is not a full hardware security assessment. Future device support must require an explicit user interaction, narrowly scoped grants, revocation, and integration tests.

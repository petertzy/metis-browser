# Chromium Upstream and Patch Policy (Draft)

## Goals

Metis Browser should inherit timely Chromium security fixes while minimizing divergence from upstream.

## Source of truth

- Official Chromium source: https://chromium.googlesource.com/chromium/src/
- Chromium release information: https://chromereleases.googleblog.com/
- Kiwi references: https://github.com/kiwibrowser/src and https://github.com/kiwibrowser/src.next

Kiwi is a historical architecture reference, not the source of security updates.

## Baseline selection

A native Chromium integration must select a currently supported stable branch, record the full revision and dependency state, and document platform build requirements. No baseline is selected yet.

## Patch rules

- Maintain a numbered inventory of Metis-specific patches, their rationale, affected components, owners, and tests.
- Prefer upstream APIs and isolated modules over broad modifications to Chromium internals.
- Rebase or merge security updates promptly, and require tests for any conflict resolution.
- Preserve original license and copyright notices in copied or modified upstream files.
- Do not add Kiwi or Chromium source files without attribution and a license review.

## Release gates

Before any public release, verify:
1. Engine revision and published security status.
2. Reproducible build metadata and a dependency inventory.
3. Sandboxing, site isolation, and extension privilege boundaries.
4. Automated smoke, navigation, and permission regression tests.
5. Signing, update-channel security, and vulnerability disclosure procedures.

## Prototype distinction

The current Electron prototype is a separate experimental desktop track. Its Electron version must also be maintained and patched. It is not evidence that a native Chromium fork has been built.

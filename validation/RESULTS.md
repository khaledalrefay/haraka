# beta8 validation — 2026-09-24
PASS: 17 Node domain/integration tests, including 45 audited workout compilations and all session completions.
PASS: architecture boundaries and reachability for 24 runtime modules.
PASS: Chromium IndexedDB persistence, concurrency, duplicate actions and session expiry.
PASS: UI regression suite: 24 long-name/side-context layouts at 320×568, 360×640 and 393×852; stable controls, image loading/error, timer animation/pause, plan changes and calendar swaps.
PASS: redesign suite: home at 320×568, 360×640, 393×852 and 768×1024; all 15 session titles at 320×568; palette preview/cancel/save/reload; isolated appearance/plan saves; descriptive labels; month navigation/details/deletion; exercise/rest progress separation; no JS errors.
PASS: real browser offline reload, comparison, backup/restore, mocked reminder transport, service-worker waiting/activation and standalone HTML preview.
PASS: precache asset validation and push-handler tests.
Screenshots under current/ were inspected for home, exercise, rest, settings and history.
The release test now derives its simulated cache generation independently of the release version.
No production deployment or physical-phone push/install test was performed.

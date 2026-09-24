# beta7 validation
PASS: 17 Node domain/integration tests; 45 compiled workout audits.
PASS: IndexedDB browser transaction/concurrency/persistence tests.
PASS: current UI 24 layout cases/3 sizes, 50 categorized exercises, timer animation and touch targets.
PASS: offline/precache/push-handler tests.
PASS: release browser backup/restore/offline/update/standalone/mocked reminder transport.
PASS: previous beta6 data and backup compatibility across real SW upgrade.
PASS: reminder-server cryptography/API/SQLite/rule tests.
PASS: npm ci and fresh build; architecture import graph check (20 modules).
PASS: five fixed screenshot pixel comparisons before/after CSS cleanup.
A rapid-close/reopen race was found in the update test harness; the harness now leaves a short interval for worker activation before opening a new controlled client. Runtime waiting-update policy is unchanged.
No deployment or real-phone push/install verification was performed.

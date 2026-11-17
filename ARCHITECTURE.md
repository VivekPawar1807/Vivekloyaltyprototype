# Prototype architecture

The public demo is intentionally static.

- app.js holds the page modules, the deterministic rule calculation, client-side validation, activity recording, business scenarios, and local-storage persistence.
- styles.css contains the responsive enterprise interface.
- demo-assets/Northstar_Program_Rules.txt is a fictional, inspectable sample source.
- tests/smoke.mjs validates core deterministic calculations outside the browser.

Production LaunchPad should replace browser-only state with a tenant-isolated server API and database. Parsing, evidence verification, multi-pass AI extraction, RBAC, file scanning, rate limits, and rules-engine execution belong behind that boundary. The user interface already labels the public adapter so it cannot be mistaken for a live GRAVTY integration.

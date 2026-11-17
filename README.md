# GRAVTY LaunchPad prototype

An interactive, public-demo prototype for the GRAVTY LaunchPad self-serve loyalty-program configuration workspace. It follows the supplied product case: clients review sourced draft rules, resolve conflicts once, propose changes, run deterministic tests, and approve a versioned configuration.

## Run locally

    npm install
    npm run dev

Open http://localhost:4173. No environment variables, credentials, uploads, or network calls are required.

## What works in the demo

- A persistent Northstar Rewards workspace, stored only in browser local storage.
- Guided five-minute path: DocSense review, AskOnce decision, RuleCraft proposal, RuleGuard validation, DryRun calculation, SignOff, Program Memory, Analytics, and Business Impact.
- Deterministic points calculation, validation gating, role-gated approval, version history, audit events, a reset action, scenario switching, and a file-intake surface.
- Text and CSV files receive a lightweight browser-side evidence scan. The public static build accepts DOCX, XLSX, and PDF files into the demo intake but intentionally does not claim to parse their contents.

## Deliberate prototype boundaries

This is a front-end demonstration, not GRAVTY production software. The AI suggestions are deterministic demo data, the rule engine is a replaceable adapter, and local storage does not constitute multi-user server-side persistence or authorization. Real deployment needs a server-side database, client tenant isolation, malware scanning, file parsers, signed uploads, authenticated RBAC, audit retention, and a production-rules-engine adapter.

The app never calls a GRAVTY API, Amazon Bedrock, or a third-party service. It does not use uploaded material to train a model.

## Deploy

This repository is static and can be published directly with GitHub Pages, Netlify, Vercel, or any static host. For GitHub Pages, publish the repository root. No build command is needed.

## Test commands

    npm run check
    npm test

The smoke test covers the calculation, cap, tier transition, validation gate, and revenue totals. Browser interactions still need a visual walkthrough on the target hosting environment.

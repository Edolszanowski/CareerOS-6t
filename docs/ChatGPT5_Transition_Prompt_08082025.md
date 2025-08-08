EXECUTE — CareerOS continuity prompt



CONTEXT

You are my Tech Lead and build partner for CareerOS. I’m a “vibe coder” (beginner coding skills) working on a Next.js app with Neon (PostgreSQL), Prisma, n8n, and Vercel hosting. Frontend was originally scaffolded via v0.dev. We’re migrating all planning+execution to ChatGPT 5.0 as a single LLM and keeping the existing DB schema, questions, and frontend unless absolutely necessary.



Current state (DO NOT LOSE THIS):

\- Repo: GitHub public — owner: Edolszanowski, repo: CareerOS-6t. Local folder is C:\\Users\\edoly\\CareerOS (configured already).

\- Tech: Next.js App Router, TypeScript, Tailwind, shadcn/ui, Neon PostgreSQL.

\- DB access: Prisma (introspected) + Neon SQL where useful. .env DATABASE\_URL points to Neon with sslmode=require.

\- Auth: deferred until newsletter + “first goal” flow (keep in plan, not implemented yet).

\- Assessment: 8-question flow works end-to-end. We fixed server action to accept email OR user\_id, upsert user, map UI→DB values, and compute score. Database constraints: enums differ from UI words (journey/learning/goal). We added robust mappings.

\- Dev routes: /api/dev/inventory, /api/dev/get-user-by-email, /api/dev/create-user, etc. curl-tested in Windows Command Prompt (single-line only).

\- New feature: Industry comparison on dashboard.

&nbsp; - API added: /api/industry-stats (computes industry and role averages; returns sample + stats).

&nbsp; - UI: IndustryComparisonChart now “fail-softs” (shows friendly message when no peer data yet).

&nbsp; - Seeding: curl commands added to create peer rows for quick averages.

\- Marketing principles: user-first, value-before-ask, empathy-driven, collaborative, measurable. Use supportive language and progress feedback.

\- Delivery rules for me: Step-by-step, copy-paste-ready code, exact file paths, Windows-friendly commands (single-line), acronyms spelled out on first use, and test steps after each change.



TASK

Pick up exactly where we left off:

1\) Verify /api/industry-stats and IndustryComparisonChart are present and wired on the dashboard. If missing, generate the files with full content and Windows single-line commands to create them.

2\) Create a branch, commit, push, and open a Pull Request (PR = Pull Request) with single-line commands.

3\) Provide test steps (URLs and curl) to validate: stats load, fail-soft UI works, and averages display with seeded data.

4\) Keep a running DAILY\_SYNC.md and implementation\_tracker.md (living docs). Ask me to paste repo inventory if needed.



FORMAT

\- Use the 4-Part Structure: CONTEXT, TASK, FORMAT, CONSTRAINTS at the top of big pushes.

\- Always give complete files (no “…”), exact paths, and Windows single-line commands.

\- Include simple verification steps and local URLs to click.



CONSTRAINTS

\- Don’t rename tables or change existing DB schema unless necessary.

\- Keep empathy copy + onboarding flow tone.

\- Assume local dev path: C:\\Users\\edoly\\CareerOS

\- When giving commands, prefer Command Prompt (cmd.exe) and use PowerShell ONLY when needed to write multi-line files.

\- Spell out acronyms first time.



JUST WRITE IT — continue the build now.


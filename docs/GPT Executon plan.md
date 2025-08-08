CONTEXT

Single large language model: ChatGPT 5.0 only (no Claude).



Tech: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Neon PostgreSQL via Prisma.



Auth: deferred; we’ll pass email via query string for now.



Goal: Implement /api/industry-stats + IndustryComparisonChart with fail-soft UX (user-friendly message if no peer data).



Testing-first: seed peers, curl test, UI verification, and a Pull Request (PR = Pull Request).



TASK

Create /api/industry-stats (mapping-driven, no schema rename).



Create IndustryComparisonChart (uses Recharts; lightweight).



Wire chart on dashboard (reads ?email= from the URL).



Add a dev-only seed endpoint for quick averages.



Branch → commit → push → open PR.



Provide step-by-step tests and update living docs.



FORMAT

Full files, exact paths, Windows single-line commands.



URLs to click and curl commands to run.



Spell out acronyms first use.



CONSTRAINTS

Do not change existing database schema.



Keep empathy copy and onboarding tone.



Local path: C:\\Users\\edoly\\CareerOS.



Use Command Prompt (cmd.exe); PowerShell only when writing multi-line files.



STEP 2 — Implementation (mapping-driven)

2.1 Install chart dependency (Recharts)

cmd

Copy

Edit

cd C:\\Users\\edoly\\CareerOS

npm i recharts

2.2 API: app/api/industry-stats/route.ts

What it does



Accepts GET /api/industry-stats?email=...



Looks up the latest assessment for that email (mapping-driven fields)



Computes averages by industry and role



Returns { userStats, industryStats, roleStats } or a friendly message if not enough data



File: app/api/industry-stats/route.ts



typescript

Copy

Edit

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';



/\*\*

&nbsp;\* Mapping-driven adapter so we don't assume your exact Prisma model/fields.

&nbsp;\* If your model names or field names differ, adjust here ONLY.

&nbsp;\*/

const MODELS = {

&nbsp; assessment: 'Assessment', // e.g., 'Assessment' or 'CareerData' or 'UserAssessment'

} as const;



const FIELDS = {

&nbsp; assessment: {

&nbsp;   email: 'email',           // string

&nbsp;   industry: 'industry',     // string or enum

&nbsp;   role: 'role',             // string or enum

&nbsp;   score: 'score',           // number

&nbsp;   createdAt: 'createdAt',   // Date (for latest record)

&nbsp; },

} as const;



type AnyPrisma = typeof prisma \& { \[k: string]: any };



export async function GET(request: Request) {

&nbsp; try {

&nbsp;   const { searchParams } = new URL(request.url);

&nbsp;   const email = searchParams.get('email');



&nbsp;   if (!email) {

&nbsp;     return NextResponse.json(

&nbsp;       { error: 'Missing "email" query parameter.' },

&nbsp;       { status: 400 },

&nbsp;     );

&nbsp;   }



&nbsp;   const p = prisma as AnyPrisma;

&nbsp;   const aModel = MODELS.assessment;

&nbsp;   const aFields = FIELDS.assessment;



&nbsp;   // 1) Find the user's latest assessment by email

&nbsp;   const latest = await p\[aModel].findFirst({

&nbsp;     where: { \[aFields.email]: email },

&nbsp;     orderBy: { \[aFields.createdAt]: 'desc' },

&nbsp;     select: {

&nbsp;       \[aFields.industry]: true,

&nbsp;       \[aFields.role]: true,

&nbsp;       \[aFields.score]: true,

&nbsp;     },

&nbsp;   });



&nbsp;   if (!latest) {

&nbsp;     return NextResponse.json({

&nbsp;       message:

&nbsp;         "We couldn't find any assessment data for this email yet. Take the assessment to unlock your industry comparison.",

&nbsp;     });

&nbsp;   }



&nbsp;   const industry = latest\[aFields.industry] as string | null;

&nbsp;   const role = latest\[aFields.role] as string | null;

&nbsp;   const userScore = latest\[aFields.score] as number | null;



&nbsp;   // Guard: if required fields are missing, fail-soft.

&nbsp;   if (!industry || !role || userScore == null) {

&nbsp;     return NextResponse.json({

&nbsp;       message:

&nbsp;         'We need more details (industry, role, and score) to show comparisons. Please complete your assessment.',

&nbsp;     });

&nbsp;   }



&nbsp;   // 2) Compute averages for peers by industry and by role

&nbsp;   const \[industryAgg, roleAgg] = await Promise.all(\[

&nbsp;     p\[aModel].aggregate({

&nbsp;       where: { \[aFields.industry]: industry },

&nbsp;       \_avg: { \[aFields.score]: true },

&nbsp;     }),

&nbsp;     p\[aModel].aggregate({

&nbsp;       where: { \[aFields.role]: role },

&nbsp;       \_avg: { \[aFields.score]: true },

&nbsp;     }),

&nbsp;   ]);



&nbsp;   const industryAvg =

&nbsp;     (industryAgg?.\_avg?.\[aFields.score as any] as number | null) ?? null;

&nbsp;   const roleAvg =

&nbsp;     (roleAgg?.\_avg?.\[aFields.score as any] as number | null) ?? null;



&nbsp;   // If no peers yet, return friendly guidance

&nbsp;   if (industryAvg == null \&\& roleAvg == null) {

&nbsp;     return NextResponse.json({

&nbsp;       userStats: { score: userScore },

&nbsp;       message:

&nbsp;         "We're still gathering peer data for your industry and role. Check back soon as more people join!",

&nbsp;     });

&nbsp;   }



&nbsp;   return NextResponse.json({

&nbsp;     userStats: { score: userScore },

&nbsp;     industryStats: { score: industryAvg },

&nbsp;     roleStats: { score: roleAvg },

&nbsp;   });

&nbsp; } catch (err) {

&nbsp;   console.error('Error in /api/industry-stats:', err);

&nbsp;   return NextResponse.json(

&nbsp;     { error: 'Server error while computing industry stats.' },

&nbsp;     { status: 500 },

&nbsp;   );

&nbsp; }

}

Windows create file (then paste content in VS Code):



cmd

Copy

Edit

cd C:\\Users\\edoly\\CareerOS

mkdir app\\api\\industry-stats

echo.> app\\api\\industry-stats\\route.ts

2.3 Component: components/IndustryComparisonChart.tsx

What it does



Client component fetching /api/industry-stats?email=...



Displays a simple bar chart with Recharts



Fail-soft message when there’s no data yet (friendly tone)



File: components/IndustryComparisonChart.tsx



typescript

Copy

Edit

'use client';



import { useEffect, useState } from 'react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';



type StatsResponse = {

&nbsp; userStats?: { score: number | null };

&nbsp; industryStats?: { score: number | null };

&nbsp; roleStats?: { score: number | null };

&nbsp; message?: string;

&nbsp; error?: string;

};



export default function IndustryComparisonChart({ email }: { email: string }) {

&nbsp; const \[stats, setStats] = useState<StatsResponse | null>(null);

&nbsp; const \[loading, setLoading] = useState(true);



&nbsp; useEffect(() => {

&nbsp;   let active = true;

&nbsp;   (async () => {

&nbsp;     try {

&nbsp;       const res = await fetch(`/api/industry-stats?email=${encodeURIComponent(email)}`);

&nbsp;       const data: StatsResponse = await res.json();

&nbsp;       if (active) setStats(data);

&nbsp;     } catch (e) {

&nbsp;       if (active) setStats({ error: 'Failed to load stats.' });

&nbsp;     } finally {

&nbsp;       if (active) setLoading(false);

&nbsp;     }

&nbsp;   })();

&nbsp;   return () => {

&nbsp;     active = false;

&nbsp;   };

&nbsp; }, \[email]);



&nbsp; if (loading) return <p className="text-gray-600">Loading your industry comparison…</p>;



&nbsp; if (!stats || stats.error) {

&nbsp;   return (

&nbsp;     <div className="p-4 border rounded bg-gray-50 text-center text-gray-700">

&nbsp;       Something went wrong while loading your comparison. Please try again in a moment.

&nbsp;     </div>

&nbsp;   );

&nbsp; }



&nbsp; if (stats.message \&\& !stats.userStats?.score) {

&nbsp;   return (

&nbsp;     <div className="p-4 border rounded bg-gray-50 text-center text-gray-700">

&nbsp;       {stats.message}

&nbsp;     </div>

&nbsp;   );

&nbsp; }



&nbsp; // Build chart data even if peers missing (we show your score alone)

&nbsp; const you = stats.userStats?.score ?? 0;

&nbsp; const industry = stats.industryStats?.score ?? null;

&nbsp; const role = stats.roleStats?.score ?? null;



&nbsp; if (industry == null \&\& role == null) {

&nbsp;   return (

&nbsp;     <div className="p-4 border rounded bg-gray-50 text-center text-gray-700">

&nbsp;       {stats.message ?? "We're still gathering peer data for your industry and role. Check back soon!"}

&nbsp;     </div>

&nbsp;   );

&nbsp; }



&nbsp; const data = \[

&nbsp;   { name: 'You', score: you },

&nbsp;   ...(industry != null ? \[{ name: 'Industry Avg', score: industry }] : \[]),

&nbsp;   ...(role != null ? \[{ name: 'Role Avg', score: role }] : \[]),

&nbsp; ];



&nbsp; return (

&nbsp;   <div className="bg-white rounded-xl shadow p-4">

&nbsp;     <h2 className="text-lg font-semibold mb-2">How You Compare</h2>

&nbsp;     <p className="text-sm text-gray-600 mb-4">

&nbsp;       See how your current score stacks up against your industry and role peers.

&nbsp;     </p>

&nbsp;     <div className="h-64">

&nbsp;       <ResponsiveContainer width="100%" height="100%">

&nbsp;         <BarChart data={data}>

&nbsp;           <XAxis dataKey="name" />

&nbsp;           <YAxis />

&nbsp;           <Tooltip />

&nbsp;           <Legend />

&nbsp;           <Bar dataKey="score" />

&nbsp;         </BarChart>

&nbsp;       </ResponsiveContainer>

&nbsp;     </div>

&nbsp;   </div>

&nbsp; );

}

Windows create file:



cmd

Copy

Edit

cd C:\\Users\\edoly\\CareerOS

mkdir components

echo.> components\\IndustryComparisonChart.tsx

2.4 Wire it on the dashboard (reads ?email=)

File: app/dashboard/page.tsx (complete file; adjust to your existing layout as needed)



typescript

Copy

Edit

import IndustryComparisonChart from '@/components/IndustryComparisonChart';



// App Router pages receive searchParams

export default function DashboardPage({ searchParams }: { searchParams: { \[key: string]: string | string\[] | undefined } }) {

&nbsp; const emailParam = typeof searchParams?.email === 'string' ? searchParams.email : '';



&nbsp; return (

&nbsp;   <div className="p-6 space-y-6">

&nbsp;     <h1 className="text-2xl font-bold">Your Dashboard</h1>



&nbsp;     {!emailParam ? (

&nbsp;       <div className="p-4 border rounded bg-yellow-50 text-yellow-800">

&nbsp;         Add <span className="font-mono">?email=you@example.com</span> to the URL to load your comparison.

&nbsp;         <div className="mt-2 text-sm text-gray-700">

&nbsp;           Example: <span className="font-mono">http://localhost:3000/dashboard?email=you@example.com</span>

&nbsp;         </div>

&nbsp;       </div>

&nbsp;     ) : (

&nbsp;       <IndustryComparisonChart email={emailParam} />

&nbsp;     )}

&nbsp;   </div>

&nbsp; );

}

Windows create file (if missing):



cmd

Copy

Edit

cd C:\\Users\\edoly\\CareerOS

mkdir app\\dashboard

echo.> app\\dashboard\\page.tsx

2.5 Dev seed endpoint (optional, fast testing)

What it does



POST /api/dev/seed-industry-peers



Body: { "industry": "Technology", "role": "Developer", "emails": \["p1@x.com","p2@x.com"], "scores": \[72, 84] }



Creates simple peer rows in the assessment model (mapping-driven)



File: app/api/dev/seed-industry-peers/route.ts



typescript

Copy

Edit

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';



const MODELS = { assessment: 'Assessment' } as const;

const FIELDS = {

&nbsp; assessment: {

&nbsp;   email: 'email',

&nbsp;   industry: 'industry',

&nbsp;   role: 'role',

&nbsp;   score: 'score',

&nbsp; },

} as const;



type AnyPrisma = typeof prisma \& { \[k: string]: any };



export async function POST(req: Request) {

&nbsp; try {

&nbsp;   const body = await req.json();

&nbsp;   const { industry, role, emails, scores } = body || {};



&nbsp;   if (!industry || !role || !Array.isArray(emails) || !Array.isArray(scores) || emails.length !== scores.length) {

&nbsp;     return NextResponse.json(

&nbsp;       { error: 'Provide industry, role, and matching arrays: emails\[], scores\[]' },

&nbsp;       { status: 400 },

&nbsp;     );

&nbsp;   }



&nbsp;   const p = prisma as AnyPrisma;

&nbsp;   const aModel = MODELS.assessment;

&nbsp;   const aFields = FIELDS.assessment;



&nbsp;   const createOps = emails.map((email: string, i: number) =>

&nbsp;     p\[aModel].create({

&nbsp;       data: {

&nbsp;         \[aFields.email]: email,

&nbsp;         \[aFields.industry]: industry,

&nbsp;         \[aFields.role]: role,

&nbsp;         \[aFields.score]: Number(scores\[i]),

&nbsp;       },

&nbsp;     }),

&nbsp;   );



&nbsp;   await Promise.all(createOps);



&nbsp;   return NextResponse.json({ ok: true, inserted: emails.length });

&nbsp; } catch (err) {

&nbsp;   console.error('seed-industry-peers error:', err);

&nbsp;   return NextResponse.json({ error: 'Server error while seeding.' }, { status: 500 });

&nbsp; }

}

Windows create file:



cmd

Copy

Edit

cd C:\\Users\\edoly\\CareerOS

mkdir app\\api\\dev\\seed-industry-peers

echo.> app\\api\\dev\\seed-industry-peers\\route.ts

STEP 3 — Branch, Commit, Push, PR

cmd

Copy

Edit

cd C:\\Users\\edoly\\CareerOS

git checkout -b feature/industry-comparison

git add app\\api\\industry-stats\\route.ts components\\IndustryComparisonChart.tsx app\\dashboard\\page.tsx app\\api\\dev\\seed-industry-peers\\route.ts

git commit -m "feat: industry comparison API, chart, dashboard wiring, and dev seeding"

git push origin feature/industry-comparison

If you have GitHub CLI (Command Line Interface):



cmd

Copy

Edit

gh pr create --title "Industry Comparison: API + Chart + Dashboard" --body "Adds mapping-driven /api/industry-stats, IndustryComparisonChart (Recharts), dashboard wiring via ?email=, and /api/dev/seed-industry-peers for quick testing."

STEP 4 — Test Steps (end-to-end)

Run dev server



cmd

Copy

Edit

npm run dev

Open: http://localhost:3000



Seed peers (Technology/Developer example)



cmd

Copy

Edit

curl -X POST "http://localhost:3000/api/dev/seed-industry-peers" -H "Content-Type: application/json" -d "{\\"industry\\":\\"Technology\\",\\"role\\":\\"Developer\\",\\"emails\\":\[\\"peer1@example.com\\",\\"peer2@example.com\\"],\\"scores\\":\[72,84]}"

Verify API (replace with your real assessment email)



cmd

Copy

Edit

curl "http://localhost:3000/api/industry-stats?email=you@example.com"

Expect: { userStats: { score: N }, industryStats: { score: N? }, roleStats: { score: N? } }



If peers aren’t available yet: JSON with a friendly message.



Verify UI



With email: http://localhost:3000/dashboard?email=you@example.com



Expect a bar chart with You, and any available Industry Avg and Role Avg.



Fail-soft path: use an email with no assessment



Expect a friendly message prompting users to complete the assessment.



PR Review



Visit your repo → confirm PR is open



Merge when satisfied



STEP 5 — Update Living Docs

Append to DAILY\_SYNC.md (PowerShell one-liner):



powershell

Copy

Edit

powershell -Command "Add-Content -Path 'DAILY\_SYNC.md' -Value '## 2025-08-08 (cont.)`n- Implemented mapping-driven /api/industry-stats and IndustryComparisonChart (Recharts)`n- Wired chart on /dashboard with ?email=`n- Added /api/dev/seed-industry-peers for quick peer averages`n- Opened PR feature/industry-comparison`n'"

Append to implementation\_tracker.md:



powershell

Copy

Edit

powershell -Command "Add-Content -Path 'implementation\_tracker.md' -Value '## Progress 2025-08-08`n- Industry comparison implemented end-to-end (API + UI + seeding)`n- No schema changes; mapping layer isolates model/field names`n- Next: lock mappings to schema.prisma and remove any v0.dev remnants`n'"

NEXT (your call)

Lock the mappings: Paste your prisma/schema.prisma models for the assessment entity (or whichever table holds email, industry, role, score, createdAt). I’ll set the constants in one shot so the code matches your real schema with zero guesswork.



Cleanup: If our dir /s /b | findstr /i "v0.dev" produced hits, I’ll remove those references safely.



n8n pipeline (newsletter): When you say EXECUTE, I’ll scaffold the Monday morning pipeline (source → filter → generate → QA → schedule) with environment variables and curl-able webhooks.






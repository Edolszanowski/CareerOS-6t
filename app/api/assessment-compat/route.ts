import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// New (current) assessment field shape
type NewShape = {
  user_id?: number | string | null;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  question_1_journey?: string;
  question_2_industry?: string;
  question_3a_level?: string;
  question_3b_role_title?: string;
  question_4_knowledge?: string;
  question_5_automation_pct?: number;
  question_6_superpower?: string;
  question_7_learning_style?: string;
  question_8_goal?: string;
};

// Old/legacy (v0.dev) shape we want to accept for compatibility
type OldShape = {
  ai_journey?: string;
  ai_industry?: string;
  ai_role?: string;
  ai_understanding?: string;
  automation_pct?: number;
  ai_strength?: string;
  learning_pref?: string;
  future_goal?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  user_id?: number | string | null;
};

// --- mapping helpers (old -> new enums) ---
function uiJourneyToDb(v?: string) {
  const m: Record<string, "never" | "rarely" | "monthly" | "weekly" | "daily"> = {
    "daily-user": "daily",
    experimenting: "weekly",
    curious: "monthly",
    behind: "rarely",
    new: "never",
    daily: "daily",
    weekly: "weekly",
    monthly: "monthly",
    rarely: "rarely",
    never: "never",
  };
  return m[(v || "").toLowerCase()] ?? "monthly";
}

function uiKnowledgeToDb(v?: string) {
  const m: Record<string, "expert" | "strategic" | "basics" | "lost" | "new"> = {
    expert: "expert",
    strategic: "strategic",
    practical: "basics",
    basics: "basics",
    lost: "lost",
    zero: "new",
    new: "new",
  };
  return m[(v || "").toLowerCase()] ?? "basics";
}

function uiLearningToDb(v?: string) {
  const m: Record<string, "veryfast" | "fast" | "moderate" | "slow" | "veryslow"> = {
    "dive-in": "fast",
    veryfast: "veryfast",
    fast: "fast",
    moderate: "moderate",
    slow: "slow",
    veryslow: "veryslow",
    experiential: "veryfast",
    sequential: "fast",
    conceptual: "moderate",
    supported: "slow",
    iterative: "veryslow",
  };
  return m[(v || "").toLowerCase()] ?? "moderate";
}

function uiGoalToDb(v?: string) {
  const m: Record<string, "leading" | "managing" | "specialist" | "transitioning" | "business" | "balance"> = {
    changemaker: "leading",
    leadership: "managing",
    specialist: "specialist",
    entrepreneur: "business",
    security: "balance",
    balance: "balance",
  };
  return m[(v || "").toLowerCase()] ?? "balance";
}

function roleToLevel(v?: string) {
  const t = (v || "").toLowerCase();
  if (["exec", "executive", "cxo", "vp"].some((s) => t.includes(s))) return "executive";
  if (["manager", "management"].some((s) => t.includes(s))) return "management";
  if (t.includes("senior")) return "senior";
  if (t.includes("intern") || t.includes("student")) return "student";
  return (t as any) || "mid";
}

// scoring: 0-100 (4 factors @ 25 each)
function calcScore(
  j: "never" | "rarely" | "monthly" | "weekly" | "daily",
  k: "expert" | "strategic" | "basics" | "lost" | "new",
  a: number,
  l: "veryfast" | "fast" | "moderate" | "slow" | "veryslow"
) {
  let s = 0;
  const J: any = { daily: 25, weekly: 20, monthly: 15, rarely: 10, never: 5 };
  s += J[j];
  const K: any = { expert: 25, strategic: 20, basics: 15, lost: 10, new: 5 };
  s += K[k];
  const A = Math.max(25 - Math.round(a / 4), 5); // 0..25 (min 5)
  s += A;
  const L: any = { veryfast: 25, fast: 20, moderate: 15, slow: 10, veryslow: 5 };
  s += L[l];
  return Math.min(100, Math.max(0, s));
}

// if it looks like the old payload, convert it to the new shape
function normalize(body: any): NewShape {
  if (body && (body.ai_journey || body.ai_industry || body.ai_role || body.ai_understanding)) {
    const old = body as OldShape;
    const out: NewShape = {
      email: old.email ?? null,
      first_name: old.first_name ?? null,
      last_name: old.last_name ?? null,
      user_id: old.user_id ?? null,
      question_1_journey: uiJourneyToDb(old.ai_journey),
      question_2_industry: (old.ai_industry || "").toLowerCase(),
      question_3a_level: roleToLevel(old.ai_role),
      question_3b_role_title: old.ai_role || null,
      question_4_knowledge: uiKnowledgeToDb(old.ai_understanding),
      question_5_automation_pct: Number(old.automation_pct ?? 0),
      question_6_superpower: old.ai_strength || "strategic",
      question_7_learning_style: uiLearningToDb(old.learning_pref),
      question_8_goal: uiGoalToDb(old.future_goal),
    };
    return out;
  }
  return body as NewShape;
}

export async function POST(req: Request) {
  try {
    const incoming = normalize(await req.json());

    // find or create user
    let userId: number | null = null;

    if (incoming.user_id !== undefined && incoming.user_id !== null && incoming.user_id !== "") {
      const n = Number(incoming.user_id);
      if (Number.isNaN(n)) {
        return NextResponse.json({ ok: false, error: "user_id is not a valid number" }, { status: 400 });
      }
      userId = n;
    } else if (incoming.email) {
      const email = (incoming.email as string).trim().toLowerCase();
      const u = await prisma.users.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: [incoming.first_name, incoming.last_name].filter(Boolean).join(" ") || null,
          created_at: new Date(),
        },
        select: { id: true },
      });
      userId = u.id;

      // WITHOUT unique constraint on user_profiles.user_id:
      const existing = await prisma.user_profiles.findFirst({ where: { user_id: userId } });
      if (existing) {
        await prisma.user_profiles.update({
          where: { id: existing.id },
          data: {
            first_name: incoming.first_name ?? undefined,
            last_name: incoming.last_name ?? undefined,
            job_title: incoming.question_3b_role_title ?? undefined,
            updated_at: new Date(),
          },
        });
      } else {
        await prisma.user_profiles.create({
          data: {
            user_id: userId,
            first_name: incoming.first_name ?? null,
            last_name: incoming.last_name ?? null,
            job_title: incoming.question_3b_role_title ?? null,
            created_at: new Date(),
          },
        });
      }
    } else {
      return NextResponse.json({ ok: false, error: "Provide either user_id or email." }, { status: 400 });
    }

    // normalize enums/values
    const journey = uiJourneyToDb(incoming.question_1_journey);
    const knowledge = uiKnowledgeToDb(incoming.question_4_knowledge);
    const learning = uiLearningToDb(incoming.question_7_learning_style);
    const goal = uiGoalToDb(incoming.question_8_goal);
    const industry = (incoming.question_2_industry || "").toLowerCase();
    const level = roleToLevel(incoming.question_3a_level);
    const automationPct = Math.min(100, Math.max(0, Number(incoming.question_5_automation_pct) || 0));
    const score = calcScore(journey, knowledge, automationPct, learning);

    const created = await prisma.assessment_responses.create({
      data: {
        user_id: userId!,
        question_1_journey: journey,
        question_2_industry: industry,
        question_3a_level: level as any,
        question_3b_role_title: incoming.question_3b_role_title ?? null,
        question_4_knowledge: knowledge,
        question_5_automation_pct: automationPct,
        question_6_superpower: incoming.question_6_superpower ?? "strategic",
        question_7_learning_style: learning,
        question_8_goal: goal,
        ai_readiness_score: score,
        completed_at: new Date(),
        created_at: new Date(),
      },
      select: { id: true, ai_readiness_score: true, user_id: true },
    });

    return NextResponse.json({
      ok: true,
      assessment_id: created.id,
      ai_readiness_score: created.ai_readiness_score,
      user_id: created.user_id,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
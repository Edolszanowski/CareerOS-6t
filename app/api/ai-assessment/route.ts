import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AssessmentInput } from "@/lib/validation";
import { calculateReadinessScore } from "@/lib/score";
import { track } from "@/lib/telemetry";
import {
  normalizeJourney,
  normalizeRoleLevel,
  normalizeKnowledge,
  normalizeLearning,
  normalizeGoal,
  normalizeSuperpower,
} from "@/lib/normalize";

export async function POST(req: Request) {
  try {
    const parsed = AssessmentInput.parse(await req.json());

    const journey = normalizeJourney(parsed.question_1_journey);
    if (!journey) return NextResponse.json({ ok: false, error: "Invalid question_1_journey" }, { status: 400 });

    const roleLevel = normalizeRoleLevel(parsed.question_3a_level);
    // roleLevel is optional in DB, so null is OK if user didn't select
    const knowledge = normalizeKnowledge(parsed.question_4_knowledge);
    const learning  = normalizeLearning(parsed.question_7_learning_style);
    const goal      = normalizeGoal(parsed.question_8_goal);
    const superpow  = normalizeSuperpower(parsed.question_6_superpower);

    track("assessment_started", { user_id: parsed.user_id });

    const score = calculateReadinessScore({
      question_1_journey: journey,
      question_4_knowledge: knowledge ?? undefined,
      question_5_automation_pct: parsed.question_5_automation_pct,
      question_7_learning_style: learning ?? undefined,
    });

    const rec = await prisma.assessment_responses.create({
      data: {
        user_id: parsed.user_id,
        question_1_journey: journey,
        question_2_industry: parsed.question_2_industry ?? null,
        question_3a_level: roleLevel ?? null,
        question_3b_role_title: parsed.question_3b_role_title ?? null,
        question_4_knowledge: knowledge ?? null,
        question_5_automation_pct: parsed.question_5_automation_pct ?? null,
        question_6_superpower: superpow ?? null,
        question_7_learning_style: learning ?? null,
        question_8_goal: goal ?? null,
        ai_readiness_score: score,
      },
    });

    track("score_calculated", { user_id: parsed.user_id, score, rec_id: rec.id });
    track("assessment_completed", { user_id: parsed.user_id, rec_id: rec.id });

    return NextResponse.json({ ok: true, id: rec.id, ai_readiness_score: score });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 400 });
  }
}

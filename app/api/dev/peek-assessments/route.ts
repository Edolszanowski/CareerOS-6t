import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.assessment_responses.findMany({
      orderBy: { completed_at: "desc" },
      take: 10,
      select: {
        id: true,
        user_id: true,
        ai_readiness_score: true,
        completed_at: true,
        question_1_journey: true,
        question_2_industry: true,
        question_3a_level: true,
        question_3b_role_title: true,
        question_4_knowledge: true,
        question_5_automation_pct: true,
        question_6_superpower: true,
        question_7_learning_style: true,
        question_8_goal: true,
        users: { select: { email: true, name: true } }
      }
    });
    return NextResponse.json({ ok: true, count: rows.length, rows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
{\rtf1}
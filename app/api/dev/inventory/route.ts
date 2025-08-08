import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [usersCount, profilesCount, assessmentsCount] = await Promise.all([
      prisma.users.count(),
      prisma.user_profiles.count(),
      prisma.assessment_responses.count(),
    ]);

    const latest = await prisma.assessment_responses.findFirst({
      orderBy: { completed_at: "desc" },
      select: {
        id: true,
        user_id: true,
        ai_readiness_score: true,
        completed_at: true,
        question_2_industry: true,
        question_3a_level: true,
        question_3b_role_title: true,
      },
    });

    return NextResponse.json({
      ok: true,
      tablesExist: true,
      counts: { users: usersCount, user_profiles: profilesCount, assessment_responses: assessmentsCount },
      latest_assessment: latest ? {
        id: latest.id,
        user_id: latest.user_id,
        ai_readiness_score: latest.ai_readiness_score,
        completed_at: latest.completed_at,
        industry: latest.question_2_industry,
        role_level: latest.question_3a_level,
        role_title: latest.question_3b_role_title
      } : null,
      notes: "DEV ONLY. Remove before going live."
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

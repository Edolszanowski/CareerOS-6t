import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take = Math.min(Number(searchParams.get("limit") ?? "25"), 200);

    const rows = await prisma.users.findMany({
      take,
      orderBy: { id: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        user_profiles: {
          select: { job_title: true },
          take: 1,
        },
        assessment_responses: {
          orderBy: { completed_at: "desc" },
          take: 1,
          select: {
            ai_readiness_score: true,
            question_2_industry: true,
          },
        },
      },
    });

    const mapped = rows.map((u) => ({
      user_id: u.id,
      email: u.email,
      name: u.name,
      job_title: u.user_profiles[0]?.job_title ?? null,
      industry: u.assessment_responses[0]?.question_2_industry ?? null,
      ai_readiness_score: u.assessment_responses[0]?.ai_readiness_score ?? null,
    }));

    return NextResponse.json({ ok: true, count: mapped.length, rows: mapped });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}

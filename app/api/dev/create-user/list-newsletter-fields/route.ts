import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DEV ONLY: list fields needed for newsletter (limit/offset). Remove or protect before prod.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? 100), 1000);
    const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

    const users = await prisma.users.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true, email: true, name: true,
        user_profiles: { select: { job_title: true }, take: 1 },
        assessment_responses: {
          select: { ai_readiness_score: true, question_2_industry: true, completed_at: true },
          orderBy: { completed_at: "desc" }, take: 1
        }
      },
      orderBy: { id: "asc" }
    });

    const rows = users.map(u => ({
      user_id: u.id,
      email: u.email,
      name: u.name ?? null,
      job_title: u.user_profiles[0]?.job_title ?? null,
      industry: u.assessment_responses[0]?.question_2_industry ?? null,
      ai_readiness_score: u.assessment_responses[0]?.ai_readiness_score ?? null,
      last_assessed_at: u.assessment_responses[0]?.completed_at ?? null
    }));

    return NextResponse.json({ ok: true, count: rows.length, rows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}

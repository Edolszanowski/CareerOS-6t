import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user-journey/[userId]
 * Resolves userId from async params (Next.js 15+), returns latest assessment basics.
 * Adjust the select/return shape as you prefer — this is safe and minimal.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: userIdStr } = await ctx.params; // <-- await params
    const userId = Number.parseInt(userIdStr);

    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Pull latest assessment for the user
    const latest = await prisma.assessment_responses.findFirst({
      where: { user_id: userId },
      orderBy: { completed_at: "desc" },
      select: {
        ai_readiness_score: true,
        question_2_industry: true,
        question_3a_level: true,
        completed_at: true,
      },
    });

    if (!latest) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      userId,
      latest,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}

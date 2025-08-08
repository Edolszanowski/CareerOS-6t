import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") ?? `tester_${Date.now()}@example.com`;
  const first_name = searchParams.get("first_name");
  const last_name = searchParams.get("last_name");
  const job_title = searchParams.get("job_title");
  const name = [first_name, last_name].filter(Boolean).join(" ") || null;

  try {
    const user = await prisma.users.create({ data: { email, name } });
    if (first_name || last_name || job_title) {
      await prisma.user_profiles.create({
        data: { user_id: user.id, first_name: first_name ?? undefined, last_name: last_name ?? undefined, job_title: job_title ?? undefined },
      });
    }
    return NextResponse.json({ ok: true, user_id: user.id, email });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 400 });
  }
}

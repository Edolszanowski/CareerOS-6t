import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// DEV ONLY: lists CHECK constraint definitions for key assessment columns
export async function GET() {
  try {
    const rows = await sql/* sql */`
      SELECT c.conname AS name, pg_get_constraintdef(c.oid) AS definition
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE t.relname = 'assessment_responses'
      ORDER BY c.conname;
    `;

    return NextResponse.json({ ok: true, constraints: rows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}

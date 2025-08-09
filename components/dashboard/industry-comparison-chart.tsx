"use client";

import React from "react";

type Stats = {
  industry: string;
  industry_avg: number | null;
  industry_count: number;
  role_level: string | null;
  role_avg: number | null;
  role_count: number;
};

type ApiResponse =
  | {
      ok: true;
      stats: Stats;
      sample: Array<{
        id: number;
        score: number | null;
        role_level: string | null;
        completed_at: string;
      }>;
    }
  | { ok: false; error: string };

export default function IndustryComparisonChart(props: {
  /** e.g., "Technology & Software" or "technology" */
  industry: string;
  /** e.g., "management" (optional) */
  roleLevel?: string | null;
  /** user’s score (optional, display only) */
  userScore?: number | null;
}) {
  const { industry, roleLevel, userScore } = props;

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<Stats | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          industry: (industry || "").toLowerCase(),
        });
        if (roleLevel) params.set("role_level", roleLevel.toLowerCase());

        const res = await fetch(`/api/industry-stats?${params.toString()}`, {
          cache: "no-store",
        });
        const json: ApiResponse = await res.json();

        if (!json || (json as any).ok !== true) {
          throw new Error((json as any)?.error || "No assessment data available for comparison");
        }

        if (!cancelled) setStats(json.stats);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load comparison data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [industry, roleLevel]);

  if (loading) {
    return <div className="p-4 rounded-2xl border">Loading industry comparison…</div>;
  }

  if (error || !stats) {
    return (
      <div className="p-4 rounded-2xl border">
        <h3 className="text-lg font-semibold mb-2">Industry comparison</h3>
        <p className="text-gray-600">
          Not enough peer data yet for <strong>{industry}</strong>
          {roleLevel ? (
            <>
              {" "}
              at <strong>{roleLevel}</strong> level
            </>
          ) : null}
          . We’ll show comparisons as soon as we have a few more assessments. No judgment, just support.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl border space-y-3">
      <h3 className="text-lg font-semibold">Industry comparison</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl border">
          <div className="text-sm text-gray-600">Your score</div>
          <div className="text-3xl font-bold">{userScore ?? "—"}</div>
        </div>
        <div className="p-3 rounded-xl border">
          <div className="text-sm text-gray-600">Industry avg ({stats.industry_count})</div>
          <div className="text-3xl font-bold">{stats.industry_avg ?? "—"}</div>
        </div>
        <div className="p-3 rounded-xl border">
          <div className="text-sm text-gray-600">
            {stats.role_level ? <>Role avg ({stats.role_level})</> : "Role avg"}
            {stats.role_count ? ` (${stats.role_count})` : ""}
          </div>
          <div className="text-3xl font-bold">{stats.role_avg ?? "—"}</div>
        </div>
      </div>
      <p className="text-gray-600 text-sm">
        We’ll keep building benchmarks as more people in <strong>{stats.industry}</strong>
        {stats.role_level ? (
          <>
            {" "}
            at <strong>{stats.role_level}</strong> level
          </>
        ) : null}{" "}
        complete the assessment.
      </p>
    </div>
  );
}

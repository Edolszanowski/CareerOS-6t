"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type JourneyLatest = {
  ai_readiness_score?: number | null;
  question_2_industry?: string | null;
  question_3a_level?: string | null;
  completed_at?: string | null;
};

type ApiOk = {
  ok: true;
  userId: number;
  latest?: JourneyLatest | null;
};

type ApiErr = { ok: false; error?: string };

export function JourneyProgress({ userId }: { userId: number }) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [latest, setLatest] = React.useState<JourneyLatest | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function fetchJourneyData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/user-journey/${userId}`, { cache: "no-store" });
        // Defensive: non-200 still might have JSON
        let json: ApiOk | ApiErr | any = null;
        try {
          json = await res.json();
        } catch {
          throw new Error("Invalid response format"); // no JSON body
        }

        // Accept the current API: { ok:true, userId, latest:{...} }
        if (!json || json.ok !== true) {
          // Show server-provided error if present
          const msg = (json && json.error) ? json.error : "No journey data yet";
          throw new Error(msg);
        }

        const l = (json as ApiOk).latest ?? null;

        if (!cancelled) setLatest(l);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load journey");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchJourneyData();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Journey Progress</CardTitle>
          <CardDescription>Loading your latest progress…</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Journey Progress</CardTitle>
          <CardDescription>We couldn’t load your progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {error}. No worries — as soon as you complete an assessment, we’ll start tracking your journey here.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!latest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Journey Progress</CardTitle>
          <CardDescription>No journey data yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Take the assessment to kick off your personalized AI journey. We’ll show progress and milestones here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const score = latest.ai_readiness_score ?? "—";
  const industry = latest.question_2_industry ?? "—";
  const level = latest.question_3a_level ?? "—";
  const completedAt = latest.completed_at ? new Date(latest.completed_at).toLocaleString() : "—";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journey Progress</CardTitle>
        <CardDescription>Your latest assessment snapshot</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div className="text-sm text-gray-600">AI Readiness Score</div>
            <div className="text-2xl font-bold">{score}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border p-3">
              <div className="text-sm text-gray-600">Industry</div>
              <div className="text-lg font-semibold capitalize">{industry}</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-sm text-gray-600">Role level</div>
              <div className="text-lg font-semibold capitalize">{level}</div>
            </div>
          </div>

          <div className="text-sm text-gray-500">Completed: {completedAt}</div>
          <p className="text-sm text-gray-600">
            We’ll guide you step-by-step. As you progress, this section will reflect milestones and next best actions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

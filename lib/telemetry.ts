type EventName = "assessment_started" | "question_answered" | "assessment_completed" | "score_calculated";
export function track(event: EventName, data: Record<string, unknown> = {}) {
  console.log(`telemetry:${event}`, { ts: new Date().toISOString(), ...data });
}

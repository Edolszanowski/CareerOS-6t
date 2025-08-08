export function calculateReadinessScore(responses: {
  question_1_journey?: string;
  question_4_knowledge?: string;
  question_5_automation_pct?: number;
  question_7_learning_style?: string;
}) {
  let score = 0;
  const journey = { "daily-user":25, experimenting:20, curious:15, behind:10, new:5 };
  score += journey[responses.question_1_journey ?? "new"] ?? 5;

  const knowledge = { expert:25, strategic:20, basics:15, lost:10, new:5 };
  score += knowledge[responses.question_4_knowledge ?? "new"] ?? 5;

  const pct = Number(responses.question_5_automation_pct ?? 0);
  score += Math.max(25 - pct / 4, 5);

  const learning = { experiential:25, sequential:20, conceptual:15, supported:10, iterative:5 };
  score += learning[responses.question_7_learning_style ?? "conceptual"] ?? 15;

  return Math.round(Math.min(100, score));
}

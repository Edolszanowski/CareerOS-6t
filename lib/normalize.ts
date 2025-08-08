// lib/normalize.ts

// Q1 Journey — DB allows: never | rarely | monthly | weekly | daily
export function normalizeJourney(input?: string | null) {
  if (!input) return null as const;
  const v = String(input).toLowerCase().trim();
  if (["never", "rarely", "monthly", "weekly", "daily"].includes(v)) return v as
    | "never" | "rarely" | "monthly" | "weekly" | "daily";

  // UI -> DB map
  const map: Record<string, "never" | "rarely" | "monthly" | "weekly" | "daily"> = {
    "daily-user": "daily",
    "experimenting": "weekly",
    "curious": "monthly",
    "behind": "rarely",
    "new": "never",
  };
  return map[v] ?? null;
}

// Q3a Role level — DB allows (all lowercase): executive | management | senior | mid | early | freelance | owner | student
export function normalizeRoleLevel(input?: string | null) {
  if (!input) return null as const;
  const v = String(input).toLowerCase().trim();
  if (["executive","management","senior","mid","early","freelance","owner","student"].includes(v)) {
    return v as
      | "executive" | "management" | "senior" | "mid" | "early" | "freelance" | "owner" | "student";
  }
  // If UI sends capitalized values, just lower-case is fine
  return null;
}

// Q4 Knowledge — DB allows: expert | strategic | basics | lost | new  (UI already matches)
export function normalizeKnowledge(input?: string | null) {
  if (!input) return null as const;
  const v = String(input).toLowerCase().trim();
  if (["expert","strategic","basics","lost","new"].includes(v)) return v as
    | "expert" | "strategic" | "basics" | "lost" | "new";
  return null;
}

// Q7 Learning style — DB allows: veryfast | fast | moderate | slow | veryslow
// UI uses: experiential | sequential | conceptual | supported | iterative
export function normalizeLearning(input?: string | null) {
  if (!input) return null as const;
  const v = String(input).toLowerCase().trim();
  if (["veryfast","fast","moderate","slow","veryslow"].includes(v)) return v as
    | "veryfast" | "fast" | "moderate" | "slow" | "veryslow";

  const map: Record<string, "veryfast" | "fast" | "moderate" | "slow" | "veryslow"> = {
    // You can tweak these buckets later if you prefer different semantics
    "experiential": "fast",
    "sequential": "moderate",
    "conceptual": "moderate",
    "supported": "slow",
    "iterative": "veryslow",
  };
  return map[v] ?? null;
}

// Q8 Goal — DB allows: leading | managing | specialist | transitioning | business | balance
// UI uses: changemaker | leadership | specialist | security | entrepreneur | balance
export function normalizeGoal(input?: string | null) {
  if (!input) return null as const;
  const v = String(input).toLowerCase().trim();
  if (["leading","managing","specialist","transitioning","business","balance"].includes(v)) return v as
    | "leading" | "managing" | "specialist" | "transitioning" | "business" | "balance";

  const map: Record<string, "leading" | "managing" | "specialist" | "transitioning" | "business" | "balance"> = {
    "leadership": "leading",
    "changemaker": "leading",      // could also be "managing" — adjust if you prefer
    "specialist": "specialist",
    "security": "managing",        // aiming for stability → managing
    "entrepreneur": "business",
    "balance": "balance",
  };
  return map[v] ?? null;
}

// Q6 Superpower — DB allows: creative | emotional | strategic | leadership | domain | physical | ethical | cultural
export function normalizeSuperpower(input?: string | null) {
  if (!input) return null as const;
  const v = String(input).toLowerCase().trim();
  if (["creative","emotional","strategic","leadership","domain","physical","ethical","cultural"].includes(v)) return v as
    | "creative" | "emotional" | "strategic" | "leadership" | "domain" | "physical" | "ethical" | "cultural";
  return null;
}

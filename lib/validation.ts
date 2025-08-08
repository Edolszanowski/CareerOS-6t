// lib/validation.ts
import { z } from "zod";

export const AssessmentInput = z.object({
  user_id: z.number().int().positive(),

  // Accept UI or DB words; we normalize later
  question_1_journey: z
    .enum(["never","rarely","monthly","weekly","daily","daily-user","experimenting","curious","behind","new"])
    .optional(),

  question_2_industry: z.string().max(100).optional(),

  question_3a_level: z
    .enum(["executive","management","senior","mid","early","freelance","owner","student",
           "Executive","Management","Senior","Mid","Early","Freelance","Owner","Student"])
    .optional(),

  question_3b_role_title: z.string().max(100).optional(),

  question_4_knowledge: z
    .enum(["expert","strategic","basics","lost","new",
           "Expert","Strategic","Basics","Lost","New"])
    .optional(),

  question_5_automation_pct: z.number().int().min(0).max(100).optional(),

  question_6_superpower: z
    .enum(["creative","emotional","strategic","leadership","domain","physical","ethical","cultural",
           "Creative","Emotional","Strategic","Leadership","Domain","Physical","Ethical","Cultural"])
    .optional(),

  // Accept UI and DB vocab
  question_7_learning_style: z
    .enum(["veryfast","fast","moderate","slow","veryslow",
           "experiential","sequential","conceptual","supported","iterative"])
    .optional(),

  question_8_goal: z
    .enum(["leading","managing","specialist","transitioning","business","balance",
           "changemaker","leadership","specialist","security","entrepreneur","balance"])
    .optional(),
});

'use client'

import { AIAssessmentFlow } from "@/components/ai-assessment/ai-assessment-flow"
import { OnboardingProvider } from "@/contexts/onboarding-context"

export default function AssessmentPage() {
  return (
    <OnboardingProvider>
      <AIAssessmentFlow />
    </OnboardingProvider>
  )
}
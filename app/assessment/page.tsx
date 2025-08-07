'use client'

import { AIAssessmentFlow } from "@/components/ai-assessment/ai-assessment-flow"
import { OnboardingProvider } from "@/contexts/onboarding-context"

export default function AssessmentPage() {
  return (
    <div className="min-h-screen">
      <OnboardingProvider>
        {/* Create a wrapper that sets the required context */}
        <AssessmentWrapper />
      </OnboardingProvider>
    </div>
  )
}

function AssessmentWrapper() {
  // This ensures the OnboardingProvider has the required data
  return <AIAssessmentFlow />
}
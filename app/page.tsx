"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { OnboardingProvider } from "@/contexts/onboarding-context"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { DatabaseTest } from "@/components/database-test"
import { ConnectionStatus } from "@/components/connection-status"
import { AIAssessmentTest } from "@/components/ai-assessment/ai-assessment-test"

export default function Page() {
  const [showTest, setShowTest] = useState(false)

  if (showTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="space-y-4 w-full max-w-4xl">
          <DatabaseTest />
          <AIAssessmentTest />
          <Button onClick={() => setShowTest(false)} variant="outline" className="w-full">
            Back to Onboarding
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <Button onClick={() => setShowTest(true)} variant="outline" size="sm">
          Test DB
        </Button>
      </div>

      <ConnectionStatus />

      <OnboardingProvider>
        <OnboardingFlow />
      </OnboardingProvider>
    </div>
  )
}

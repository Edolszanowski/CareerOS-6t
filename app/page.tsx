'use client'

import { OnboardingProvider } from '@/contexts/onboarding-context'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'

export default function HomePage() {
  return (
    <OnboardingProvider>
      <OnboardingFlow />
    </OnboardingProvider>
  )
}

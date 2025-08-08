"use client"

import { useState } from "react"
import { OnboardingProvider } from "@/contexts/onboarding-context"
import { WelcomeScreen } from "./welcome-screen"
import { UserTypeQuestion } from "./user-type-question"
import { AIJourneyQuestion } from "./ai-journey-question"
import { AIIndustryQuestion } from "./ai-industry-question"
import { AIRoleQuestion } from "./ai-role-question"
import { AIUnderstandingQuestion } from "./ai-understanding-question"
import { AIWorkAssistanceQuestion } from "./ai-work-assistance-question"
import { AISuperpowerQuestion } from "./ai-superpower-question"
import { AILearningStyleQuestion } from "./ai-learning-style-question"
import { AIVisionQuestion } from "./ai-vision-question"
import { PersonalizedInsights } from "./personalized-insights"
import { ContactInfoForm } from "./contact-info-form"
import { CompletionScreen } from "./completion-screen"

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { component: WelcomeScreen, name: "welcome" },
    { component: UserTypeQuestion, name: "userType" },
    { component: AIJourneyQuestion, name: "aiJourney" },
    { component: AIIndustryQuestion, name: "aiIndustry" },
    { component: AIRoleQuestion, name: "aiRole" },
    { component: AIUnderstandingQuestion, name: "aiUnderstanding" },
    { component: AIWorkAssistanceQuestion, name: "aiWorkAssistance" },
    { component: AISuperpowerQuestion, name: "aiSuperpower" },
    { component: AILearningStyleQuestion, name: "aiLearningStyle" },
    { component: AIVisionQuestion, name: "aiVision" },
    { component: PersonalizedInsights, name: "insights" },
    { component: ContactInfoForm, name: "contact" },
    { component: CompletionScreen, name: "completion" }
  ]

  const CurrentStepComponent = steps[currentStep]?.component

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!CurrentStepComponent) {
    return <div>Step not found</div>
  }

  return (
    <OnboardingProvider>
      <CurrentStepComponent 
        onNext={handleNext} 
        onPrev={handlePrev}
        currentStep={currentStep}
        totalSteps={steps.length}
      />
    </OnboardingProvider>
  )
}

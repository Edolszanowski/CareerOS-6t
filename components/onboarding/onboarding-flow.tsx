"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { WelcomeScreen } from "./welcome-screen"
import { UserTypeQuestion } from "./user-type-question"
import { ToolsInterestQuestion } from "./tools-interest-question"
import { AIAssessmentFlow } from "../ai-assessment/ai-assessment-flow"
import { EmployerToolsQuestion } from "./employer-tools-question"
import { EmployerContactForm } from "./employer-contact-form"
import { EmployerCompletion } from "./employer-completion"
import { CareerStageQuestion } from "./career-stage-question"
import { CareerGoalQuestion } from "./career-goal-question"
import { BiggestChallengeQuestion } from "./biggest-challenge-question"
import { PersonalizedInsights } from "./personalized-insights"
import { ContactInfoForm } from "./contact-info-form"
import { CompletionScreen } from "./completion-screen"

export function OnboardingFlow() {
  const { currentStep, userData } = useOnboarding()

  // Check if user selected AI preparedness assessment
  if (userData.toolsInterest?.includes("ai-preparedness")) {
    return <AIAssessmentFlow />
  }

  // Handle branching logic based on user type
  if (userData.userType === "employer") {
    switch (currentStep) {
      case 1:
        return <WelcomeScreen />
      case 2:
        return <UserTypeQuestion />
      case 3:
        return <EmployerToolsQuestion />
      case 4:
        return <EmployerContactForm />
      case 5:
        return <EmployerCompletion />
      default:
        return <WelcomeScreen />
    }
  }

  // Employee flow
  switch (currentStep) {
    case 1:
      return <WelcomeScreen />
    case 2:
      return <UserTypeQuestion />
    case 3:
      return <ToolsInterestQuestion />
    case 4:
      return <CareerStageQuestion />
    case 5:
      return <CareerGoalQuestion />
    case 6:
      return <BiggestChallengeQuestion />
    case 7:
      return <PersonalizedInsights />
    case 8:
      return <ContactInfoForm />
    case 9:
      return <CompletionScreen />
    default:
      return <WelcomeScreen />
  }
}

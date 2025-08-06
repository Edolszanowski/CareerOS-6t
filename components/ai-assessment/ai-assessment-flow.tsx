"use client"

import { useState } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { AIJourneyQuestion } from "./ai-journey-question"
import { AIIndustryWorldQuestion } from "./ai-industry-world-question"
import { AIRoleQuestion } from "./ai-role-question"
import { AIUnderstandingQuestion } from "./ai-understanding-question"
import { AIWorkAssistanceQuestion } from "./ai-work-assistance-question"
import { AISuperPowerQuestion } from "./ai-superpower-question"
import { AILearningStyleQuestion } from "./ai-learning-style-question"
import { AIVisionQuestion } from "./ai-vision-question"
import { AIAssessmentResults } from "./ai-assessment-results"
import { AIEmailCapture } from "./ai-email-capture"
import { AIIndustryUpdates } from "./ai-industry-updates"
import { AIDashboard } from "./ai-dashboard"
import { saveAIAssessment } from "@/actions/ai-assessment-actions"

export function AIAssessmentFlow() {
  const { userData, userId } = useOnboarding()
  const [currentQuestion, setCurrentQuestion] = useState(1)
  
  // State matching your database column names
  const [responses, setResponses] = useState({
    question_1_journey: '',
    question_2_industry: '',
    question_3a_level: '',
    question_3b_role_title: '',
    question_4_knowledge: '',
    question_5_automation_pct: 50,
    question_6_superpower: '',
    question_7_learning_style: '',
    question_8_goal: ''
  })

  const updateResponse = (key: string, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }))
  }

  const nextQuestion = () => {
    setCurrentQuestion(prev => prev + 1)
  }

  const prevQuestion = () => {
    setCurrentQuestion(prev => Math.max(1, prev - 1))
  }

  const completeAssessmentFlow = async () => {
    await saveAIAssessment(userId, responses)
    setCurrentQuestion(prev => prev + 1)
  }

  // Only show AI assessment if user selected "ai-preparedness" tool
  if (!userData.toolsInterest?.includes("ai-preparedness")) {
    return null
  }

  switch (currentQuestion) {
    case 1:
      return (
        <AIJourneyQuestion
          onNext={nextQuestion}
          onUpdate={(value) => updateResponse("question_1_journey", value)}
          currentValue={responses.question_1_journey}
        />
      )
    case 2:
      return (
        <AIIndustryWorldQuestion
          onNext={nextQuestion}
          onPrev={prevQuestion}
          onUpdate={(value) => updateResponse("question_2_industry", value)}
          currentValue={responses.question_2_industry}
        />
      )
    case 3:
      return (
        <AIRoleQuestion
          onNext={nextQuestion}
          onPrev={prevQuestion}
          onUpdate={(value) => {
            updateResponse("question_3a_level", value.role)
            updateResponse("question_3b_role_title", value.function)
          }}
          currentValue={{ 
            role: responses.question_3a_level, 
            function: responses.question_3b_role_title 
          }}
        />
      )
    case 4:
      return (
        <AIUnderstandingQuestion
          onNext={nextQuestion}
          onPrev={prevQuestion}
          onUpdate={(value) => updateResponse("question_4_knowledge", value)}
          currentValue={responses.question_4_knowledge}
        />
      )
    case 5:
      return (
        <AIWorkAssistanceQuestion
          onNext={nextQuestion}
          onPrev={prevQuestion}
          onUpdate={(value) => updateResponse("question_5_automation_pct", value)}
          currentValue={responses.question_5_automation_pct}
        />
      )
    case 6:
      return (
        <AISuperPowerQuestion
          onNext={nextQuestion}
          onPrev={prevQuestion}
          onUpdate={(value) => updateResponse("question_6_superpower", value)}
          currentValue={responses.question_6_superpower}
        />
      )
    case 7:
      return (
        <AILearningStyleQuestion
          onNext={nextQuestion}
          onPrev={prevQuestion}
          onUpdate={(value) => updateResponse("question_7_learning_style", value)}
          currentValue={responses.question_7_learning_style}
        />
      )
    case 8:
      return (
        <AIVisionQuestion
          onNext={completeAssessmentFlow}
          onPrev={prevQuestion}
          onUpdate={(value) => updateResponse("question_8_goal", value)}
          currentValue={responses.question_8_goal}
        />
      )
    case 9:
      return <AIAssessmentResults onNext={nextQuestion} responses={responses} userId={userId} />
    case 10:
      return <AIEmailCapture onNext={nextQuestion} onPrev={prevQuestion} responses={responses} userId={userId} />
    case 11:
      return <AIIndustryUpdates onNext={nextQuestion} onPrev={prevQuestion} />
    case 12:
      return <AIDashboard responses={responses} userId={userId} />
    default:
      return (
        <AIJourneyQuestion
          onNext={nextQuestion}
          onUpdate={(value) => updateResponse("question_1_journey", value)}
          currentValue={responses.question_1_journey}
        />
      )
  }
}

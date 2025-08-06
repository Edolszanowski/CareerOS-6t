"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Clock, Shield, Sparkles, ArrowRight } from 'lucide-react'
import { saveAIAssessment } from "@/actions/ai-assessment-actions"

interface AssessmentFormProps {
  onComplete: (score: number) => void
  userId: number
  userType?: string // For personalization
  careerStage?: string // For personalization
}

interface AssessmentData {
  question_1_journey: string
  question_2_industry: string
  question_3a_level: string
  question_3b_role_title: string
  question_4_knowledge: string
  question_5_automation_pct: number
  question_6_superpower: string
  question_7_learning_style: string
  question_8_goal: string
  ai_readiness_score?: number
}

export function MarketingAlignedAssessment({ onComplete, userId, userType, careerStage }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0) // 0 = value preview, 1-8 = questions
  const [responses, setResponses] = useState<AssessmentData>({
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

  // 🎯 USER-FIRST PERSONALIZATION
  const getPersonalizedHeadline = () => {
    if (careerStage === "recent-grad") {
      return "Your AI Career Advantage Assessment"
    } else if (careerStage === "mid-career") {
      return "Navigate AI Changes in Your Field"
    } else if (careerStage === "senior-career") {
      return "Lead Through AI Transformation"
    }
    return "Discover Your AI Readiness"
  }

  const getPersonalizedSubtext = () => {
    if (careerStage === "recent-grad") {
      return "Start your career AI-ready. See exactly where you stand and what to focus on first."
    } else if (careerStage === "mid-career") {
      return "Feeling uncertain about AI's impact? Get clarity on your position and next steps."
    }
    return "Understand how AI affects your role and get a personalized action plan."
  }

  // 📊 VALUE-BEFORE-ASK: Preview what they'll get
  const ValuePreview = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Personalized headline */}
            <div className="space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{getPersonalizedHeadline()}</h1>
              <p className="text-gray-600">{getPersonalizedSubtext()}</p>
            </div>

            {/* Value proposition - what they'll get */}
            <div className="space-y-4 text-left">
              <h3 className="font-semibold text-gray-900 text-center">You'll discover:</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <Sparkles className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Your AI Readiness Score</p>
                    <p className="text-sm text-green-700">See exactly where you stand (0-100 scale)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Personalized Action Plan</p>
                    <p className="text-sm text-blue-700">3 specific steps to advance your career</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900">Industry-Specific Insights</p>
                    <p className="text-sm text-purple-700">How AI impacts your specific field</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Empathy + time commitment */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center space-x-2 text-yellow-800 mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium text-sm">Just 3 minutes</span>
              </div>
              <p className="text-sm text-yellow-700">
                We know you're busy. This assessment is designed to give you maximum insight with minimal time investment.
              </p>
            </div>

            <Button 
              onClick={() => setCurrentStep(1)} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 text-base font-medium"
            >
              Start My Assessment
            </Button>

            <p className="text-xs text-gray-500 text-center">
              No email required to start • See your results immediately
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Calculate AI Readiness Score
  const calculateReadinessScore = (data: AssessmentData): number => {
    let score = 0
    
    // Question 1: Journey stage (0-25 points)
    switch (data.question_1_journey) {
      case "daily-user": score += 25; break
      case "experimenting": score += 20; break
      case "curious": score += 15; break
      case "behind": score += 10; break
      case "new": score += 5; break
    }
    
    // Question 4: Knowledge level (0-25 points)
    switch (data.question_4_knowledge) {
      case "expert": score += 25; break
      case "strategic": score += 20; break
      case "practical": score += 15; break
      case "lost": score += 10; break
      case "zero": score += 5; break
    }
    
    // Question 5: Automation comfort (0-25 points)
    const automationScore = Math.round((data.question_5_automation_pct / 100) * 25)
    score += automationScore
    
    // Question 8: Future vision (0-25 points)
    switch (data.question_8_goal) {
      case "changemaker": score += 25; break
      case "leadership": score += 22; break
      case "specialist": score += 20; break
      case "entrepreneur": score += 23; break
      case "security": score += 15; break
      case "balance": score += 18; break
    }
    
    return Math.min(100, score)
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!responses.question_1_journey || !responses.question_2_industry) {
      // Show empathetic error message
      return
    }
    
    // Calculate score
    const score = calculateReadinessScore(responses)
    
    // Save to database
    const result = await saveAIAssessment({
      ...responses,
      ai_readiness_score: score,
      user_id: userId,
      email: "" // Will be captured later if needed
    })
    
    if (result.success) {
      onComplete(score)
    }
  }

  // Show value preview first (VALUE-BEFORE-ASK)
  if (currentStep === 0) {
    return <ValuePreview />
  }

  // Assessment questions (simplified for example)
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress header with empathy */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Question {currentStep} of 8</h1>
            <p className="text-sm text-gray-600">Taking your time is perfectly fine</p>
          </div>
          <div className="text-sm text-gray-500">
            {Math.round((currentStep / 8) * 100)}% complete
          </div>
        </div>
        <Progress value={(currentStep / 8) * 100} className="h-2" />
      </div>

      {/* Question content would go here */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Individual question components would be rendered here based on currentStep */}
          <p className="text-gray-600">Question {currentStep} content...</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 border-t border-gray-100">
        <div className="max-w-md mx-auto flex gap-3">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1"
            >
              Previous
            </Button>
          )}
          <Button 
            onClick={currentStep === 8 ? handleSubmit : () => setCurrentStep(currentStep + 1)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            {currentStep === 8 ? "Get My Results" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}

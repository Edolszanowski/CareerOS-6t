"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from 'lucide-react'
import { saveAIAssessment } from "@/actions/ai-assessment-actions"

interface AssessmentFormProps {
  onComplete: (score: number) => void
  userId: number
  userType?: string
  careerStage?: string
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

// Question data with empathetic messaging
const questions = [
  {
    id: 1,
    title: "Where are you in your AI journey?",
    subtitle: "No judgment - we meet you where you are",
    options: [
      { id: "daily-user", text: "I use AI tools daily and want to do more", note: "You're ahead of 72% of professionals" },
      { id: "experimenting", text: "I've started experimenting with AI", note: "Perfect starting point" },
      { id: "curious", text: "I'm curious but haven't started yet", note: "Your curiosity will serve you well" },
      { id: "behind", text: "I feel behind and need guidance", note: "You're taking the right first step" },
      { id: "new", text: "I'm completely new to AI", note: "Fresh perspective is valuable" }
    ]
  },
  {
    id: 2,
    title: "What industry do you work in?",
    subtitle: "We'll tailor insights to your specific field",
    options: [
      { id: "technology", text: "Technology & Software" },
      { id: "healthcare", text: "Healthcare & Life Sciences" },
      { id: "financial", text: "Financial Services" },
      { id: "manufacturing", text: "Manufacturing" },
      { id: "retail", text: "Retail & E-commerce" },
      { id: "education", text: "Education" },
      { id: "marketing", text: "Marketing & Creative" },
      { id: "legal", text: "Legal & Professional Services" },
      { id: "other", text: "Other" }
    ]
  },
  // Add remaining questions following the same pattern...
]

export function AssessmentForm({ onComplete, userId, userType, careerStage }: AssessmentFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1)
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
  const [selectedAnswer, setSelectedAnswer] = useState('')

  const updateResponse = (key: keyof AssessmentData, value: string | number) => {
    setResponses(prev => ({ ...prev, [key]: value }))
  }

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

  const handleNext = () => {
    if (currentQuestion === 1) {
      updateResponse('question_1_journey', selectedAnswer)
    } else if (currentQuestion === 2) {
      updateResponse('question_2_industry', selectedAnswer)
    }
    // Add other question mappings...

    if (currentQuestion < 8) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!responses.question_1_journey || !responses.question_2_industry) {
      return
    }
    
    // Calculate score
    const score = calculateReadinessScore(responses)
    
    // Save to database with correct user_id type
    const result = await saveAIAssessment({
      ...responses,
      ai_readiness_score: score,
      user_id: userId, // Already INTEGER from props
      email: "" // Will be captured later
    })
    
    if (result.success) {
      onComplete(score)
    }
  }

  const currentQ = questions.find(q => q.id === currentQuestion)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with progress */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {currentQuestion > 1 && (
            <Button variant="ghost" size="sm" onClick={() => setCurrentQuestion(currentQuestion - 1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">AI Preparedness Assessment</div>
            <div className="text-xs text-gray-500">Question {currentQuestion} of 8</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div 
          className="bg-black h-1 transition-all duration-300" 
          style={{ width: `${(currentQuestion / 8) * 100}%` }} 
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-900">{currentQ?.title}</h1>
            <p className="text-gray-600">{currentQ?.subtitle}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ?.options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedAnswer(option.id)}
                className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                  selectedAnswer === option.id 
                    ? "border-black bg-gray-50" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900 mb-1">{option.text}</p>
                  {option.note && (
                    <p className="text-sm text-gray-600 italic">({option.note})</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium disabled:bg-gray-300"
          >
            {currentQuestion === 8 ? "Get My Results" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}

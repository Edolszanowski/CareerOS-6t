"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, Shield, Lightbulb } from 'lucide-react'

interface AIAssessmentResultsProps {
  onNext: () => void
  responses: any
  userId?: number
}

export function AIAssessmentResults({ onNext, responses, userId }: AIAssessmentResultsProps) {
  // Calculate scores based on responses using the same logic as the server
  const calculateScores = () => {
    let aiReadinessScore = 0
    
    // Question 1: Journey stage (0-25 points)
    switch (responses.question_1_journey) {
      case "daily-user": aiReadinessScore += 25; break
      case "experimenting": aiReadinessScore += 20; break
      case "curious": aiReadinessScore += 15; break
      case "behind": aiReadinessScore += 10; break
      case "new": aiReadinessScore += 5; break
    }
    
    // Question 4: Knowledge level (0-25 points)
    switch (responses.question_4_knowledge) {
      case "expert": aiReadinessScore += 25; break
      case "strategic": aiReadinessScore += 20; break
      case "practical": aiReadinessScore += 15; break
      case "lost": aiReadinessScore += 10; break
      case "zero": aiReadinessScore += 5; break
    }
    
    // Question 5: Automation comfort (0-25 points)
    const automationScore = Math.round((responses.question_5_automation_pct / 100) * 25)
    aiReadinessScore += automationScore
    
    // Question 8: Future vision (0-25 points)
    switch (responses.question_8_goal) {
      case "changemaker": aiReadinessScore += 25; break
      case "leadership": aiReadinessScore += 22; break
      case "specialist": aiReadinessScore += 20; break
      case "entrepreneur": aiReadinessScore += 23; break
      case "security": aiReadinessScore += 15; break
      case "balance": aiReadinessScore += 18; break
    }
    
    const totalScore = Math.min(100, aiReadinessScore)
    
    // Break down into component scores for display
    return {
      aiReadiness: totalScore,
      usage: responses.question_1_journey === "daily-user" ? 85 : 
             responses.question_1_journey === "experimenting" ? 65 : 45,
      understanding: responses.question_4_knowledge === "expert" ? 95 :
                    responses.question_4_knowledge === "strategic" ? 80 : 60,
      futureReadiness: Math.round((totalScore + responses.question_5_automation_pct) / 2),
    }
  }

  const scores = calculateScores()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div>
          <div className="text-sm font-medium text-gray-900">AI Preparedness Assessment</div>
          <div className="text-xs text-gray-500">Your Results</div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Here are your results</h1>
            <p className="text-gray-600">
              Based on your responses, here's your AI readiness assessment
            </p>
          </div>

          {/* Main AI Readiness Score */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <Brain className="w-12 h-12 text-blue-600 mx-auto" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{scores.aiReadiness}/100</h2>
                  <p className="text-lg font-medium text-gray-700">AI Readiness Score</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {scores.aiReadiness >= 75 ? "You're well-positioned for AI adoption!" :
                     scores.aiReadiness >= 50 ? "Good foundation with room to grow" :
                     "Great starting point - lots of opportunity ahead!"}
                  </p>
                </div>
                <Progress value={scores.aiReadiness} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Breakdown Scores */}
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Current Usage</h3>
                    <p className="text-sm text-gray-600">How actively you use AI today</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score</span>
                    <span className="font-medium">{scores.usage}/100</span>
                  </div>
                  <Progress value={scores.usage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Understanding</h3>
                    <p className="text-sm text-gray-600">Your knowledge of AI capabilities</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score</span>
                    <span className="font-medium">{scores.understanding}/100</span>
                  </div>
                  <Progress value={scores.understanding} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Future Readiness</h3>
                    <p className="text-sm text-gray-600">Preparedness for AI-driven changes</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score</span>
                    <span className="font-medium">{scores.futureReadiness}/100</span>
                  </div>
                  <Progress value={scores.futureReadiness} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <Button onClick={onNext} className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

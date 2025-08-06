"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, BookOpen, TrendingUp, Users, Calendar, ArrowRight } from "lucide-react"

interface AIDashboardProps {
  assessmentData: Record<string, any>
}

export function AIDashboard({ assessmentData }: AIDashboardProps) {
  // Calculate scores based on assessment data
  const calculateScores = () => {
    let aiPreparedness = 0
    let usage = 0
    let understanding = 0
    let futureReadiness = 0

    // AI Preparedness Score (0-100) - based on familiarity
    if (assessmentData.familiarity === "very-familiar") aiPreparedness = 85
    else if (assessmentData.familiarity === "somewhat-familiar") aiPreparedness = 65
    else if (assessmentData.familiarity === "slightly-familiar") aiPreparedness = 40
    else aiPreparedness = 20

    // Usage Score - simulated based on familiarity
    if (assessmentData.familiarity === "very-familiar") usage = 80
    else if (assessmentData.familiarity === "somewhat-familiar") usage = 55
    else if (assessmentData.familiarity === "slightly-familiar") usage = 30
    else usage = 10

    // Understanding Score - based on industry applications selected
    const industryCount = assessmentData.industryApplications?.length || 0
    understanding = Math.min(100, industryCount * 15 + 25)

    // Future Readiness Score - combination of familiarity and understanding
    futureReadiness = Math.min(100, (aiPreparedness + understanding) / 2)

    return {
      aiPreparedness,
      usage,
      understanding,
      futureReadiness,
    }
  }

  const scores = calculateScores()
  const overallScore = Math.round(
    (scores.aiPreparedness + scores.usage + scores.understanding + scores.futureReadiness) / 4,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Preparedness Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your AI readiness and development progress</p>
            </div>
            <div className="text-lg font-bold">Career OS</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Scores */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span>Overall AI Preparedness</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{overallScore}/100</span>
                    <span className="text-sm text-gray-600">
                      {overallScore >= 75 ? "Advanced" : overallScore >= 50 ? "Intermediate" : "Beginner"}
                    </span>
                  </div>
                  <Progress value={overallScore} className="h-3" />
                  <p className="text-sm text-gray-600">
                    {overallScore >= 75
                      ? "You're well-positioned for AI adoption with strong foundational knowledge."
                      : overallScore >= 50
                        ? "You have good AI awareness with opportunities for practical application."
                        : "Great starting point! Focus on building foundational AI knowledge and experience."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Usage</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score</span>
                        <span className="font-medium">{scores.usage}/100</span>
                      </div>
                      <Progress value={scores.usage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Understanding</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score</span>
                        <span className="font-medium">{scores.understanding}/100</span>
                      </div>
                      <Progress value={scores.understanding} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Expand AI Tool Usage</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Try 2-3 new AI tools in your workflow this month to increase practical experience.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Industry-Specific Training</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Focus on AI applications specific to your industry to maximize relevance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Build AI Network</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Connect with AI-forward professionals in your field for insights and opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-between bg-transparent" variant="outline">
                  <span className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Training Courses
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button className="w-full justify-between bg-transparent" variant="outline">
                  <span className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    AI Tools Checklist
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button className="w-full justify-between bg-transparent" variant="outline">
                  <span className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Join AI Community
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button className="w-full justify-between bg-transparent" variant="outline">
                  <span className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule AI Consultation
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggested Learning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-900">AI Fundamentals Course</h4>
                  <p className="text-xs text-gray-600 mt-1">Perfect for your current level</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-900">Industry-Specific Updates</h4>
                  <p className="text-xs text-gray-600 mt-1">Weekly AI news for your field</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-900">Hands-on AI Workshop</h4>
                  <p className="text-xs text-gray-600 mt-1">Practical skills development</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

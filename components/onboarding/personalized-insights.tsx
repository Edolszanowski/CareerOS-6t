"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ArrowLeft, Lightbulb, Target, TrendingUp, Users, CheckCircle, Sparkles } from "lucide-react"
import { ProgressIndicator } from "./progress-indicator"

export function PersonalizedInsights() {
  const { nextStep, prevStep, userData } = useOnboarding()

  // Generate insights based on user's answers
  const generateInsights = () => {
    const insights = []

    // Career stage specific insights
    if (userData.careerStage === "recent-grad") {
      insights.push({
        icon: Target,
        title: "Focus on Building Foundation Skills",
        description:
          "As a recent graduate, prioritize developing core competencies in your field. Consider roles that offer mentorship and learning opportunities over just salary.",
        actionable: "Look for companies with strong training programs and junior development tracks.",
      })
    } else if (userData.careerStage === "mid-career") {
      insights.push({
        icon: TrendingUp,
        title: "Strategic Career Positioning",
        description:
          "You're at the perfect stage to specialize or pivot. Your experience gives you credibility to make strategic moves.",
        actionable: "Consider roles that combine your existing skills with emerging market needs.",
      })
    }

    // Goal-based insights
    if (userData.careerGoals?.includes("promotion")) {
      insights.push({
        icon: Users,
        title: "Leadership Visibility Strategy",
        description:
          "Promotions often depend on visibility and demonstrated impact. Document your achievements and seek high-visibility projects.",
        actionable: "Schedule monthly check-ins with your manager to discuss career progression.",
      })
    }

    if (userData.careerGoals?.includes("salary-increase")) {
      insights.push({
        icon: TrendingUp,
        title: "Market Rate Research",
        description:
          "Salary increases require data-driven conversations. Research market rates for your role and prepare a compelling case.",
        actionable: "Use salary comparison tools and gather 3-5 data points for your next review.",
      })
    }

    // Challenge-based insights
    if (userData.biggestChallenge === "time") {
      insights.push({
        icon: Lightbulb,
        title: "Micro-Learning Approach",
        description:
          "Career development doesn't require huge time blocks. 15-20 minutes daily can create significant progress over time.",
        actionable:
          "Set aside 15 minutes each morning for career-focused activities like skill building or networking.",
      })
    }

    if (userData.biggestChallenge === "networking") {
      insights.push({
        icon: Users,
        title: "Authentic Relationship Building",
        description:
          "Networking isn't about collecting contacts—it's about building genuine professional relationships through shared interests and mutual value.",
        actionable: "Join 1-2 professional communities related to your interests and contribute regularly.",
      })
    }

    return insights.slice(0, 3) // Return top 3 insights
  }

  const insights = generateInsights()

  const handleContinue = () => {
    nextStep()
  }

  return (
    <>
      <ProgressIndicator />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-24">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <CardTitle>Your Personalized Career Insights</CardTitle>
                </div>
                <p className="text-sm text-gray-600">Based on your responses, here's what we recommend</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-indigo-800 font-medium">{insight.actionable}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="pt-4 space-y-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800">
                  <Lightbulb className="w-5 h-5" />
                  <span className="font-medium">Want a complete personalized strategy?</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Save your assessment and get access to detailed action plans, skill recommendations, and opportunity
                  tracking.
                </p>
              </div>

              <Button onClick={handleContinue} className="w-full bg-indigo-600 hover:bg-indigo-700">
                Save My Assessment & Continue
              </Button>
              <p className="text-xs text-gray-500 text-center">We'll create your account to save these insights</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

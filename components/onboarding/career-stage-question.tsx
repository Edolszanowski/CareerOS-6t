"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ArrowLeft, Users, Briefcase, GraduationCap, TrendingUp } from "lucide-react"
import { ProgressIndicator } from "./progress-indicator"

const careerStages = [
  {
    id: "recent-grad",
    title: "Recent Graduate",
    description: "Just finished school, looking to start my career",
    icon: GraduationCap,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: "early-career",
    title: "Early Career (1-3 years)",
    description: "Building experience, figuring out my direction",
    icon: TrendingUp,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "mid-career",
    title: "Mid-Career (4-10 years)",
    description: "Looking to advance or change direction",
    icon: Briefcase,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: "senior-career",
    title: "Senior Professional (10+ years)",
    description: "Seeking leadership roles or major transitions",
    icon: Users,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    iconColor: "text-orange-600",
  },
]

export function CareerStageQuestion() {
  const { nextStep, prevStep, setUserData, userData } = useOnboarding()
  const [selectedStage, setSelectedStage] = useState(userData.careerStage || "")

  const handleContinue = () => {
    setUserData({ ...userData, careerStage: selectedStage })
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
                <CardTitle>What stage are you at in your career?</CardTitle>
                <p className="text-sm text-gray-600">
                  This helps us understand your unique challenges and opportunities
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {careerStages.map((stage) => {
              const Icon = stage.icon
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedStage === stage.id ? "border-indigo-500 bg-indigo-50" : stage.color
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon
                      className={`w-6 h-6 mt-1 ${selectedStage === stage.id ? "text-indigo-600" : stage.iconColor}`}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{stage.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}

            <div className="pt-4">
              <Button
                onClick={handleContinue}
                disabled={!selectedStage}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

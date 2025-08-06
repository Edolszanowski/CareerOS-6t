"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ArrowLeft, Target, Zap, DollarSign, MapPin, Users, BookOpen } from "lucide-react"
import { ProgressIndicator } from "./progress-indicator"

const careerGoals = [
  {
    id: "promotion",
    title: "Get Promoted",
    description: "Advance to the next level in my current field",
    icon: Target,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "career-change",
    title: "Change Careers",
    description: "Transition to a completely different field",
    icon: Zap,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: "salary-increase",
    title: "Increase Salary",
    description: "Earn more money in my current or similar role",
    icon: DollarSign,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: "remote-work",
    title: "Work Remotely",
    description: "Find flexible or location-independent opportunities",
    icon: MapPin,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: "leadership",
    title: "Lead a Team",
    description: "Move into management or leadership roles",
    icon: Users,
    color: "bg-red-50 border-red-200 hover:bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: "skills",
    title: "Learn New Skills",
    description: "Develop expertise in emerging technologies or methods",
    icon: BookOpen,
    color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
    iconColor: "text-teal-600",
  },
]

export function CareerGoalQuestion() {
  const { nextStep, prevStep, setUserData, userData } = useOnboarding()
  const [selectedGoals, setSelectedGoals] = useState<string[]>(userData.careerGoals || [])

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) => (prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]))
  }

  const handleContinue = () => {
    setUserData({ ...userData, careerGoals: selectedGoals })
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
                <CardTitle>What are your main career goals?</CardTitle>
                <p className="text-sm text-gray-600">Select all that apply - we'll prioritize based on your choices</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {careerGoals.map((goal) => {
              const Icon = goal.icon
              const isSelected = selectedGoals.includes(goal.id)
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected ? "border-indigo-500 bg-indigo-50" : goal.color
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-6 h-6 mt-1 ${isSelected ? "text-indigo-600" : goal.iconColor}`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    </div>
                    {isSelected && (
                      <div className="ml-auto">
                        <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}

            <div className="pt-4">
              <Button
                onClick={handleContinue}
                disabled={selectedGoals.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Continue ({selectedGoals.length} selected)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ArrowLeft, Clock, Search, Users, Brain, DollarSign, Map } from "lucide-react"
import { ProgressIndicator } from "./progress-indicator"

const challenges = [
  {
    id: "time",
    title: "Not enough time for career planning",
    description: "Too busy with current work to focus on growth",
    icon: Clock,
    color: "bg-red-50 border-red-200 hover:bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: "opportunities",
    title: "Don't know what opportunities exist",
    description: "Unsure what roles or paths are available to me",
    icon: Search,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "networking",
    title: "Struggling with networking",
    description: "Hard to build professional relationships",
    icon: Users,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: "skills",
    title: "Don't know what skills to develop",
    description: "Unclear which abilities will help me advance",
    icon: Brain,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: "salary",
    title: "Not earning what I'm worth",
    description: "Feel underpaid but don't know how to change it",
    icon: DollarSign,
    color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: "direction",
    title: "Unclear about career direction",
    description: "Not sure what I want to do long-term",
    icon: Map,
    color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
    iconColor: "text-teal-600",
  },
]

export function BiggestChallengeQuestion() {
  const { nextStep, prevStep, setUserData, userData } = useOnboarding()
  const [selectedChallenge, setSelectedChallenge] = useState(userData.biggestChallenge || "")

  const handleContinue = () => {
    setUserData({ ...userData, biggestChallenge: selectedChallenge })
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
                <CardTitle>What's your biggest career challenge right now?</CardTitle>
                <p className="text-sm text-gray-600">We'll focus on solving this first</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {challenges.map((challenge) => {
              const Icon = challenge.icon
              return (
                <button
                  key={challenge.id}
                  onClick={() => setSelectedChallenge(challenge.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedChallenge === challenge.id ? "border-indigo-500 bg-indigo-50" : challenge.color
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon
                      className={`w-6 h-6 mt-1 ${selectedChallenge === challenge.id ? "text-indigo-600" : challenge.iconColor}`}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{challenge.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}

            <div className="pt-4">
              <Button
                onClick={handleContinue}
                disabled={!selectedChallenge}
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

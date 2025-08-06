"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ArrowLeft, User, Users } from "lucide-react"
import { ProgressIndicator } from "./progress-indicator"

const userTypes = [
  {
    id: "employee",
    title: "I'm looking to advance my own career",
    description: "I want to grow, get promoted, change roles, or find better opportunities",
    icon: User,
  },
  {
    id: "employer",
    title: "I'm helping others with their careers",
    description: "I manage a team, run HR, or help others develop professionally",
    icon: Users,
  },
]

export function UserTypeQuestion() {
  const { nextStep, prevStep, setUserData, userData } = useOnboarding()
  const [selectedType, setSelectedType] = useState(userData.userType || "")

  const handleContinue = () => {
    setUserData({ ...userData, userType: selectedType })
    nextStep()
  }

  return (
    <>
      <ProgressIndicator />
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={prevStep} className="p-1">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="text-sm font-medium text-gray-900">Career Strategy Builder</div>
              <div className="text-xs text-gray-500">Step 1 of 5 • Understanding your perspective</div>
            </div>
          </div>
          <div className="text-lg font-bold">Career OS</div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-8">
          <div className="max-w-md mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Tell us a bit more about yourself</h1>
              <p className="text-gray-600">
                This helps us understand your unique perspective and tailor our guidance to what matters most to you.
              </p>
            </div>

            {/* User Type Options */}
            <div className="space-y-4">
              {userTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
                      selectedType === type.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-full ${
                          selectedType === type.id ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Context Message */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-blue-700">
                <strong>Why we ask:</strong> Career challenges look different depending on whether you're navigating
                your own path or helping others with theirs. We want to give you the most relevant insights.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-6 border-t border-gray-100">
          <div className="max-w-md mx-auto">
            <Button
              onClick={handleContinue}
              disabled={!selectedType}
              className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

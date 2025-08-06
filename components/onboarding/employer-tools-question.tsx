"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ArrowLeft, TrendingUp, BookOpen, Users, UserPlus } from "lucide-react"

const employerTools = [
  {
    id: "industry-updates",
    title: "Industry specific updates",
    description: "Keep your team informed about industry trends and changes",
    icon: TrendingUp,
    category: "newsletter",
  },
  {
    id: "career-guidance",
    title: "Career specific guidance and training",
    description: "Provide targeted development resources for your team",
    icon: BookOpen,
    category: "training",
  },
  {
    id: "hr-leadership",
    title: "HR & Leadership preparedness",
    description: "Develop management and leadership capabilities",
    icon: Users,
    category: "training",
  },
  {
    id: "qualified-employees",
    title: "Seeking new qualified employees",
    description: "Find and attract top talent for your organization",
    icon: UserPlus,
    category: "recruitment",
  },
]

export function EmployerToolsQuestion() {
  const { nextStep, prevStep, setUserData, userData } = useOnboarding()
  const [selectedTools, setSelectedTools] = useState<string[]>(userData.employerTools || [])

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]))
  }

  const handleContinue = () => {
    setUserData({ ...userData, employerTools: selectedTools })
    nextStep()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={prevStep} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="text-sm font-medium text-gray-900">Career OS for Teams</div>
            <div className="text-xs text-gray-500">Understanding your needs</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">How do you wish to leverage this as an employer</h1>
            <p className="text-gray-600">Choose the tools you need to help your teams succeed.</p>
          </div>

          {/* Employer Tools Options */}
          <div className="space-y-3">
            {employerTools.map((tool) => {
              const isSelected = selectedTools.includes(tool.id)
              return (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    isSelected ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{tool.title}</span>
                    {isSelected && (
                      <div className="w-5 h-5 bg-white text-gray-900 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Value Proposition */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-blue-700">
              <strong>Tailored solutions:</strong> Based on your selections, we'll provide relevant resources, training
              materials, and updates to help your team thrive in today's evolving workplace.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleContinue}
            disabled={selectedTools.length === 0}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue ({selectedTools.length} selected)
          </Button>
        </div>
      </div>
    </div>
  )
}

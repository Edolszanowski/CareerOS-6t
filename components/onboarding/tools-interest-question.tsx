"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ArrowLeft, Brain, TrendingUp, Briefcase, FileText, Search, BarChart, Zap } from "lucide-react"
import { ProgressIndicator } from "./progress-indicator"

const tools = [
  {
    id: "ai-preparedness",
    title: "Measure my AI preparedness",
    description: "Assess how ready you are for AI changes in your field",
    icon: Brain,
  },
  {
    id: "ai-impact",
    title: "Understand how AI will impact my job",
    description: "Learn what AI means for your specific role",
    icon: Zap,
  },
  {
    id: "industry-updates",
    title: "Get industry specific updates",
    description: "Stay informed about trends in your industry",
    icon: TrendingUp,
  },
  {
    id: "career-updates",
    title: "Get career specific updates",
    description: "Receive updates tailored to your career path",
    icon: Briefcase,
  },
  {
    id: "job-search",
    title: "Help me find a job",
    description: "Get assistance with job searching and applications",
    icon: Search,
  },
  {
    id: "resume-evaluation",
    title: "Evaluate my resume",
    description: "Get feedback and suggestions for your resume",
    icon: FileText,
  },
  {
    id: "market-trends",
    title: "Monitor market trends",
    description: "Track salary trends and job market changes",
    icon: BarChart,
  },
]

export function ToolsInterestQuestion() {
  const { nextStep, prevStep, setUserData, userData } = useOnboarding()
  const [selectedTools, setSelectedTools] = useState<string[]>(userData.toolsInterest || [])

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]))
  }

  const handleContinue = () => {
    setUserData({ ...userData, toolsInterest: selectedTools })
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
              <div className="text-xs text-gray-500">Step 2 of 5 • Understanding your needs</div>
            </div>
          </div>
          <div className="text-lg font-bold">Career OS</div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                393 x 50 Hug
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Which of the following tools would be most helpful to you?
              </h1>
              <p className="text-gray-600">Select all that apply</p>
            </div>

            {/* Tools Options */}
            <div className="space-y-3">
              {tools.map((tool) => {
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

            {/* Context Message */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-blue-700">
                <strong>Personalized experience:</strong> We'll prioritize these tools in your Career OS dashboard and
                send you relevant updates based on your selections.
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
    </>
  )
}

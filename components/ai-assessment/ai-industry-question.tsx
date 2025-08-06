"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AIIndustryQuestionProps {
  onNext: () => void
  onPrev: () => void
  onUpdate: (value: string[]) => void
  currentValue?: string[]
}

const industryApplications = [
  {
    id: "automation-efficiency",
    title: "Automation and efficiency",
    description: "Streamlining processes and reducing manual work",
  },
  {
    id: "data-analysis",
    title: "Data analysis and insights",
    description: "Making sense of large datasets and trends",
  },
  {
    id: "customer-service",
    title: "Customer service",
    description: "Chatbots, support automation, and personalization",
  },
  {
    id: "content-creation",
    title: "Content creation",
    description: "Writing, design, and creative assistance",
  },
  {
    id: "decision-making",
    title: "Decision making support",
    description: "AI-powered recommendations and predictions",
  },
  {
    id: "personalization",
    title: "Personalization & recommendation",
    description: "Tailored experiences and suggestions",
  },
  {
    id: "not-sure",
    title: "Not sure of the options",
    description: "I'm still learning about AI applications",
  },
]

export function AIIndustryQuestion({ onNext, onPrev, onUpdate, currentValue }: AIIndustryQuestionProps) {
  const [selected, setSelected] = useState<string[]>(currentValue || [])

  const toggleSelection = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleContinue = () => {
    if (selected.length > 0) {
      onUpdate(selected)
      onNext()
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onPrev} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="text-sm font-medium text-gray-900">AI Preparedness Assessment</div>
            <div className="text-xs text-gray-500">Question 2 of 12</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-black h-1 transition-all duration-300" style={{ width: "16.66%" }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Which of the following AI applications are most relevant to your industry?
            </h1>
            <p className="text-gray-600">Select all that apply</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {industryApplications.map((app) => {
              const isSelected = selected.includes(app.id)
              return (
                <button
                  key={app.id}
                  onClick={() => toggleSelection(app.id)}
                  className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                    isSelected ? "border-black bg-gray-50" : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{app.title}</h3>
                      <p className="text-sm text-gray-600">{app.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center ml-3">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium disabled:bg-gray-300"
          >
            Continue ({selected.length} selected)
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AIFamiliarityQuestionProps {
  onNext: () => void
  onPrev?: () => void
  onUpdate: (value: string) => void
  currentValue?: string
}

const familiarityLevels = [
  {
    id: "very-familiar",
    title: "Very familiar",
    description: "I understand AI concepts and use AI tools regularly",
  },
  {
    id: "somewhat-familiar",
    title: "Somewhat familiar",
    description: "I know the basics and have tried some AI tools",
  },
  {
    id: "slightly-familiar",
    title: "Slightly familiar",
    description: "I've heard about AI but haven't used it much",
  },
  {
    id: "not-familiar",
    title: "Not familiar at all",
    description: "AI is new to me and I'm just learning about it",
  },
]

export function AIFamiliarityQuestion({ onNext, onPrev, onUpdate, currentValue }: AIFamiliarityQuestionProps) {
  const [selected, setSelected] = useState(currentValue || "")

  const handleContinue = () => {
    if (selected) {
      onUpdate(selected)
      onNext()
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {onPrev && (
            <Button variant="ghost" size="sm" onClick={onPrev} className="p-1">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">AI Preparedness Assessment</div>
            <div className="text-xs text-gray-500">Question 1 of 12</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-black h-1 transition-all duration-300" style={{ width: "8.33%" }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              How familiar are you with artificial intelligence (AI) technology in general?
            </h1>
            <p className="text-gray-600">
              This helps us understand your starting point and tailor the assessment to your level.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {familiarityLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelected(level.id)}
                className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                  selected === level.id ? "border-black bg-gray-50" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{level.title}</h3>
                  <p className="text-sm text-gray-600">{level.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleContinue}
            disabled={!selected}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium disabled:bg-gray-300"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

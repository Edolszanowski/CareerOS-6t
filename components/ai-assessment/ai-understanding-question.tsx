"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AIUnderstandingQuestionProps {
  onNext: () => void
  onPrev: () => void
  onUpdate: (value: string) => void
  currentValue?: string
}

const understandingLevels = [
  {
    id: "expert",
    title: "I understand AI deeply and could teach others",
    note: "Leadership opportunity",
    percentage: "68%",
  },
  {
    id: "strategic",
    title: "I get the concepts and use them strategically",
    note: "Ready to level up",
    percentage: "68%",
  },
  {
    id: "practical",
    title: "I know basics but want practical confidence",
    note: "Most professionals are here",
    percentage: "68%",
  },
  {
    id: "lost",
    title: "I've heard about AI but feel lost",
    note: "We'll be your guide",
    percentage: "68%",
  },
  {
    id: "zero",
    title: "I'm starting from zero",
    note: "Fresh perspective is valuable",
    percentage: "68%",
  },
]

export function AIUnderstandingQuestion({ onNext, onPrev, onUpdate, currentValue }: AIUnderstandingQuestionProps) {
  const [selected, setSelected] = useState(currentValue || "")
  const [showResponse, setShowResponse] = useState(false)

  const handleSelection = (id: string) => {
    setSelected(id)
    setShowResponse(true)
  }

  const handleContinue = () => {
    if (selected) {
      onUpdate(selected)
      onNext()
    }
  }

  const selectedLevel = understandingLevels.find((level) => level.id === selected)

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
            <div className="text-xs text-gray-500">Question 4 of 8</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-black h-1 transition-all duration-300" style={{ width: "50%" }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-900">No Shame, Just Growth</h1>
            <p className="text-gray-600">
              Everyone's at a different point with AI - and that's perfectly fine. Which feels most true for you?
            </p>
          </div>

          {!showResponse ? (
            /* Options */
            <div className="space-y-3">
              {understandingLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleSelection(level.id)}
                  className="w-full p-4 rounded-lg text-left transition-all border-2 border-gray-200 bg-white hover:border-gray-300"
                >
                  <div>
                    <p className="font-medium text-gray-900 mb-1">{level.title}</p>
                    <p className="text-sm text-gray-600 italic">({level.note})</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Empathetic Response */
            <div className="space-y-6">
              <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-orange-900 font-medium text-center">
                  Thank you for being honest. {selectedLevel?.percentage} of professionals at your level felt the same
                  way 6 months ago - now they're thriving. We'll get you there together, step by step.
                </p>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleContinue}
                  className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

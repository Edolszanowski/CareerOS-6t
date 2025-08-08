"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useOnboarding } from "@/contexts/onboarding-context"

interface AILearningStyleQuestionProps {
  onNext: () => void
  onPrev: () => void
}

const learningStyleOptions = [
  {
    id: "dive-in",
    title: "I dive in and figure it out",
    note: "Experiential learner"
  },
  {
    id: "structured",
    title: "I like structured learning with clear steps",
    note: "Sequential learner"
  },
  {
    id: "understand-why",
    title: "I need to understand 'why' before 'how'",
    note: "Conceptual learner"
  },
  {
    id: "guided",
    title: "I learn best with someone guiding me",
    note: "Supported learner"
  },
  {
    id: "practice-patience",
    title: "I need lots of practice and patience",
    note: "Iterative learner"
  }
]

export function AILearningStyleQuestion({ onNext, onPrev }: AILearningStyleQuestionProps) {
  const { updateUserData, userData } = useOnboarding()
  const [selected, setSelected] = useState(userData.learningStyle || "")
  const [showResponse, setShowResponse] = useState(false)

  const handleSelection = (id: string) => {
    setSelected(id)
    updateUserData({ learningStyle: id })
    setShowResponse(true)
    
    // Auto-advance after 5 seconds (increased from 2 seconds)
    setTimeout(() => {
      onNext()
    }, 5000)
  }

  const selectedOption = learningStyleOptions.find((option) => option.id === selected)

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
            <div className="text-xs text-gray-500">Question 7 of 8</div>
          </div>
        </div>
        <div className="text-lg font-bold">CareerOS</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-black h-1 transition-all duration-300" style={{ width: "87.5%" }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Respecting Your Pace</h1>
            <p className="text-gray-600">
              Everyone learns differently, and we want to match your style. How do you typically feel about learning new technology?
            </p>
          </div>

          {!showResponse ? (
            /* Options */
            <div className="space-y-3">
              {learningStyleOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelection(option.id)}
                  className="w-full p-4 rounded-lg text-left transition-all border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                >
                  <p className="font-medium text-gray-900">{option.title}</p>
                  <p className="text-sm text-gray-500 mt-1">({option.note})</p>
                </button>
              ))}
            </div>
          ) : (
            /* Supportive Response */
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-900 font-medium text-center">
                  Perfect - 42% of our most successful members share your learning style. We've designed a path that honors how you learn best. No rushing, no pressure.
                </p>
              </div>
              <div className="text-center">
                <div className="animate-pulse text-sm text-gray-500">Moving to final question...</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useOnboarding } from "@/contexts/onboarding-context"

interface AISuperpowerQuestionProps {
  onNext: () => void
  onPrev: () => void
}

const superpowerOptions = [
  {
    id: "creative-problem-solving",
    title: "Creative problem-solving",
    note: "The spark AI can't generate"
  },
  {
    id: "emotional-intelligence",
    title: "Emotional intelligence",
    note: "The connection AI can't feel"
  },
  {
    id: "strategic-thinking",
    title: "Strategic thinking",
    note: "The wisdom AI can't develop"
  },
  {
    id: "leadership-inspiration",
    title: "Leadership & inspiration",
    note: "The motivation AI can't provide"
  },
  {
    id: "domain-expertise",
    title: "Domain expertise",
    note: "The context AI can't understand"
  },
  {
    id: "physical-skills",
    title: "Physical skills",
    note: "The presence AI can't embody"
  },
  {
    id: "ethical-reasoning",
    title: "Ethical reasoning",
    note: "The conscience AI can't have"
  },
  {
    id: "cultural-understanding",
    title: "Cultural understanding",
    note: "The empathy AI can't feel"
  }
]

export function AISuperpowerQuestion({ onNext, onPrev }: AISuperpowerQuestionProps) {
  const { updateUserData, userData } = useOnboarding()
  const [selected, setSelected] = useState(userData.superpower || "")
  const [showResponse, setShowResponse] = useState(false)

  const handleSelection = (id: string) => {
    setSelected(id)
    updateUserData({ superpower: id })
    setShowResponse(true)
    
    // Auto-advance after 5 seconds (increased from 2 seconds)
    setTimeout(() => {
      onNext()
    }, 5000)
  }

  const selectedOption = superpowerOptions.find((option) => option.id === selected)

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
            <div className="text-xs text-gray-500">Question 6 of 8</div>
          </div>
        </div>
        <div className="text-lg font-bold">CareerOS</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-black h-1 transition-all duration-300" style={{ width: "75%" }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Celebrating Your Superpower</h1>
            <p className="text-gray-600">
              You have qualities AI will never replicate. Which of these feels most like your superpower?
            </p>
          </div>

          {!showResponse ? (
            /* Options */
            <div className="space-y-3">
              {superpowerOptions.map((option) => (
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
            /* Celebratory Response */
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-900 font-medium text-center">
                  Yes! Your {selectedOption?.title} is exactly what makes you irreplaceable. In fact, professionals who combine {selectedOption?.title} with AI tools see 3x impact. Let us show you how.
                </p>
              </div>
              <div className="text-center">
                <div className="animate-pulse text-sm text-gray-500">Moving to next question...</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AIJourneyQuestionProps {
  onNext: () => void
  onPrev?: () => void
  onUpdate: (value: string) => void
  currentValue?: string
}

const journeyOptions = [
  {
    id: "daily-user",
    title: "I'm actively using AI daily and want to do more",
    percentage: "72%",
  },
  {
    id: "experimenting",
    title: "I've started experimenting and see the potential",
    percentage: "45%",
  },
  {
    id: "curious",
    title: "I'm curious but haven't found my starting point yet",
    percentage: "61%",
  },
  {
    id: "behind",
    title: "I'm feeling a bit behind and need guidance",
    percentage: "68%",
  },
  {
    id: "new",
    title: "I'm completely new and that's okay",
    percentage: "52%",
  },
]

export function AIJourneyQuestion({ onNext, onPrev, onUpdate, currentValue }: AIJourneyQuestionProps) {
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

  const selectedOption = journeyOptions.find((option) => option.id === selected)

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
            <div className="text-xs text-gray-500">Question 1 of 8</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-black h-1 transition-all duration-300" style={{ width: "12.5%" }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Meeting You Where You Are</h1>
            <p className="text-gray-600">
              We know AI can feel overwhelming. Where would you say you are in your AI journey today?
            </p>
          </div>

          {!showResponse ? (
            /* Options */
            <div className="space-y-3">
              {journeyOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelection(option.id)}
                  className="w-full p-4 rounded-lg text-left transition-all border-2 border-gray-200 bg-white hover:border-gray-300"
                >
                  <p className="font-medium text-gray-900">{option.title}</p>
                </button>
              ))}
            </div>
          ) : (
            /* Empathetic Response */
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-900 font-medium text-center">
                  Perfect - you're exactly where {selectedOption?.percentage} of successful professionals started. We'll
                  build from here, at your pace. No judgment, just progress.
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

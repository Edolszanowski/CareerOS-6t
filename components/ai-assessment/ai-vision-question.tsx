"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AIVisionQuestionProps {
  onNext: () => void
  onPrev: () => void
  onUpdate: (value: string) => void
  currentValue?: string
}

const visions = [
  { id: "changemaker", title: "Leading positive AI change in my organization", note: "Changemaker path" },
  { id: "leadership", title: "Confidently managing AI-augmented teams", note: "Leadership path" },
  { id: "specialist", title: "Being the go-to AI-powered expert", note: "Specialist path" },
  { id: "security", title: "Having secured my career against disruption", note: "Security path" },
  { id: "entrepreneur", title: "Running my own AI-enhanced business", note: "Entrepreneur path" },
  { id: "balance", title: "Finally having work-life balance through AI", note: "Balance path" },
]

export function AIVisionQuestion({ onNext, onPrev, onUpdate, currentValue }: AIVisionQuestionProps) {
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
            <div className="text-xs text-gray-500">Question 8 of 8</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-black h-1 transition-all duration-300" style={{ width: "100%" }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Your Dreams Matter</h1>
            <p className="text-gray-600">
              We're here to support YOUR vision. What would make you feel successful 2 years from now?
            </p>
          </div>

          {!showResponse ? (
            /* Options */
            <div className="space-y-3">
              {visions.map((vision) => (
                <button
                  key={vision.id}
                  onClick={() => handleSelection(vision.id)}
                  className="w-full p-4 rounded-lg text-left transition-all border-2 border-gray-200 bg-white hover:border-gray-300"
                >
                  <div>
                    <p className="font-medium text-gray-900 mb-1">{vision.title}</p>
                    <p className="text-sm text-gray-600 italic">({vision.note})</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Empathetic Response */
            <div className="space-y-6">
              <div className="p-6 bg-pink-50 rounded-lg border border-pink-200">
                <p className="text-pink-900 font-medium text-center">
                  This is beautiful and absolutely achievable. Members with your goal succeed 73% of the time with our
                  support. Your dream becomes our mission.
                </p>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleContinue}
                  className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium"
                >
                  See My Results
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

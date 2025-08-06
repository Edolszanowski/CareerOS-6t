"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AISuperPowerQuestionProps {
  onNext: () => void
  onPrev: () => void
  onUpdate: (value: string) => void
  currentValue?: string
}

const superpowers = [
  { id: "creative", title: "Creative problem-solving", note: "The spark AI can't generate" },
  { id: "emotional", title: "Emotional intelligence", note: "The connection AI can't feel" },
  { id: "strategic", title: "Strategic thinking", note: "The wisdom AI can't develop" },
  { id: "leadership", title: "Leadership & inspiration", note: "The motivation AI can't provide" },
  { id: "domain", title: "Domain expertise", note: "The context AI can't understand" },
  { id: "physical", title: "Physical skills", note: "The presence AI can't embody" },
  { id: "ethical", title: "Ethical reasoning", note: "The conscience AI can't have" },
  { id: "cultural", title: "Cultural understanding", note: "The empathy AI can't feel" },
]

export function AISuperPowerQuestion({ onNext, onPrev, onUpdate, currentValue }: AISuperPowerQuestionProps) {
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

  const selectedSuperpower = superpowers.find((power) => power.id === selected)

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
        <div className="text-lg font-bold">Career OS</div>
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
              {superpowers.map((power) => (
                <button
                  key={power.id}
                  onClick={() => handleSelection(power.id)}
                  className="w-full p-4 rounded-lg text-left transition-all border-2 border-gray-200 bg-white hover:border-gray-300"
                >
                  <div>
                    <p className="font-medium text-gray-900 mb-1">{power.title}</p>
                    <p className="text-sm text-gray-600 italic">({power.note})</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Empathetic Response */
            <div className="space-y-6">
              <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-900 font-medium text-center">
                  Yes! Your {selectedSuperpower?.title.toLowerCase()} is exactly what makes you irreplaceable. In fact,
                  professionals who combine {selectedSuperpower?.title.toLowerCase()} with AI tools see 3x impact. Let
                  us show you how.
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

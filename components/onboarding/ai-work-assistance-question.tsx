"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useOnboarding } from "@/contexts/onboarding-context"

interface AIWorkAssistanceQuestionProps {
  onNext: () => void
  onPrev: () => void
}

export function AIWorkAssistanceQuestion({ onNext, onPrev }: AIWorkAssistanceQuestionProps) {
  const { updateUserData, userData } = useOnboarding()
  const [percentage, setPercentage] = useState(userData.workAssistancePercentage || 50)
  const [showResponse, setShowResponse] = useState(false)

  const handleSliderChange = (value: number) => {
    setPercentage(value)
    updateUserData({ workAssistancePercentage: value })
  }

  const handleContinue = () => {
    setShowResponse(true)
    
    // Auto-advance after 5 seconds (increased from 3 seconds)
    setTimeout(() => {
      onNext()
    }, 5000)
  }

  const getResponseMessage = (percent: number) => {
    if (percent <= 20) {
      return "Your role is naturally AI-resistant - let's add AI as your assistant"
    } else if (percent <= 40) {
      return "Perfect balance - AI handles routine, you handle what matters"
    } else if (percent <= 60) {
      return "Great opportunity to offload boring work and focus on meaningful tasks"
    } else if (percent <= 80) {
      return "Time to evolve your role into something even more valuable"
    } else {
      return "Big transformation ahead - we'll navigate it together"
    }
  }

  const getDetailedResponse = (percent: number) => {
    return `Here's what others in your situation discovered: AI handling ${percent}% of tasks meant they finally got to focus on the work that energized them. Let's build that future together.`
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
            <div className="text-xs text-gray-500">Question 5 of 8</div>
          </div>
        </div>
        <div className="text-lg font-bold">CareerOS</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-black h-1 transition-all duration-300" style={{ width: "62.5%" }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Facing Fears Together</h1>
            <p className="text-gray-600">
              It's natural to wonder about job security. If you had to guess, what percentage of your daily work could AI potentially help with?
            </p>
          </div>

          {!showResponse ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">AI could assist with:</div>
                  <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
                  <div className="text-xs text-gray-500 mt-1">(Remember: Assistance isn't replacement)</div>
                </div>
                
                <div className="px-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={percentage}
                    onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 text-center">
                    {getResponseMessage(percentage)}
                  </p>
                </div>
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
          ) : (
            /* Comforting Response */
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-900 font-medium text-center">
                  {getDetailedResponse(percentage)}
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

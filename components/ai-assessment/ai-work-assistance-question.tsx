"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AIWorkAssistanceQuestionProps {
  onNext: () => void
  onPrev: () => void
  onUpdate: (value: number) => void
  currentValue?: number
}

export function AIWorkAssistanceQuestion({ onNext, onPrev, onUpdate, currentValue }: AIWorkAssistanceQuestionProps) {
  const [percentage, setPercentage] = useState(currentValue || 50)
  const [showResponse, setShowResponse] = useState(false)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentage(Number(e.target.value))
  }

  const handleSubmit = () => {
    setShowResponse(true)
  }

  const handleContinue = () => {
    onUpdate(percentage)
    onNext()
  }

  const getResponseMessage = () => {
    if (percentage <= 20) {
      return "Your role is naturally AI-resistant - let's add AI as your assistant"
    } else if (percentage <= 40) {
      return "Perfect balance - AI handles routine, you handle what matters"
    } else if (percentage <= 60) {
      return "Great opportunity to offload boring work and focus on meaningful tasks"
    } else if (percentage <= 80) {
      return "Time to evolve your role into something even more valuable"
    } else {
      return "Big transformation ahead - we'll navigate it together"
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
            <div className="text-xs text-gray-500">Question 5 of 8</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
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
              It's natural to wonder about job security. If you had to guess, what percentage of your daily work could
              AI potentially help with?
            </p>
          </div>

          {!showResponse ? (
            /* Slider */
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">AI could assist with:</p>
                  <p className="text-sm text-gray-500 italic">(Remember: Assistance isn't replacement)</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={percentage}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium"
                >
                  See My Insight
                </Button>
              </div>
            </div>
          ) : (
            /* Empathetic Response */
            <div className="space-y-6">
              <div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
                <p className="text-teal-900 font-medium text-center mb-4">{getResponseMessage()}</p>
                <p className="text-teal-800 text-sm text-center">
                  Here's what others in your situation discovered: AI handling {percentage}% of tasks meant they finally
                  got to focus on the work that energized them. Let's build that future together.
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

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}

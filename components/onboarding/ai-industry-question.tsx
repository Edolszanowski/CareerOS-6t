"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useOnboarding } from "@/contexts/onboarding-context"

interface AIIndustryQuestionProps {
  onNext: () => void
  onPrev: () => void
}

const industryOptions = [
  {
    id: "technology",
    title: "Technology & Software",
    note: "Moving fast, we'll help you stay ahead"
  },
  {
    id: "healthcare",
    title: "Healthcare & Life Sciences",
    note: "Patient care always comes first"
  },
  {
    id: "financial",
    title: "Financial Services",
    note: "Trust and accuracy remain paramount"
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    note: "Your operational expertise is gold"
  },
  {
    id: "retail",
    title: "Retail & E-commerce",
    note: "Customer connection is everything"
  },
  {
    id: "education",
    title: "Education",
    note: "Shaping minds requires human wisdom"
  },
  {
    id: "marketing",
    title: "Marketing & Creative",
    note: "Creativity can't be automated"
  },
  {
    id: "legal",
    title: "Legal & Professional",
    note: "Judgment requires human experience"
  },
  {
    id: "realestate",
    title: "Real Estate",
    note: "Relationships drive everything"
  },
  {
    id: "government",
    title: "Government & Non-profit",
    note: "Mission-driven work needs heart"
  },
  {
    id: "other",
    title: "Other",
    note: "Your unique perspective matters"
  }
]

export function AIIndustryQuestion({ onNext, onPrev }: AIIndustryQuestionProps) {
  const { updateUserData, userData } = useOnboarding()
  const [selected, setSelected] = useState(userData.industry || "")
  const [showResponse, setShowResponse] = useState(false)

  const handleSelection = (id: string) => {
    setSelected(id)
    updateUserData({ industry: id })
    setShowResponse(true)
    
    // Auto-advance after 5 seconds (increased from 2 seconds)
    setTimeout(() => {
      onNext()
    }, 5000)
  }

  const selectedOption = industryOptions.find((option) => option.id === selected)

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
            <div className="text-xs text-gray-500">Question 2 of 8</div>
          </div>
        </div>
        <div className="text-lg font-bold">CareerOS</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-black h-1 transition-all duration-300" style={{ width: "25%" }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Understanding Your World</h1>
            <p className="text-gray-600">
              Every industry faces unique AI challenges. Which world do you navigate daily? (We'll send you tailored insights every Monday to keep you ahead)
            </p>
            <p className="text-sm text-blue-600 italic">
              Your industry expertise is irreplaceable - AI should amplify it, not threaten it
            </p>
          </div>

          {!showResponse ? (
            /* Options */
            <div className="space-y-3">
              {industryOptions.map((option) => (
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
                  We're tracking how AI is reshaping {selectedOption?.title} so you don't have to worry alone. Your free weekly {selectedOption?.title} AI Digest will help you stay confidently informed, not anxiously behind.
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

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AIIndustryWorldQuestionProps {
  onNext: () => void
  onPrev: () => void
  onUpdate: (value: string) => void
  currentValue?: string
}

const industries = [
  { id: "technology", title: "Technology & Software", note: "Moving fast, we'll help you stay ahead" },
  { id: "healthcare", title: "Healthcare & Life Sciences", note: "Patient care always comes first" },
  { id: "financial", title: "Financial Services", note: "Trust and accuracy remain paramount" },
  { id: "manufacturing", title: "Manufacturing", note: "Your operational expertise is gold" },
  { id: "retail", title: "Retail & E-commerce", note: "Customer connection is everything" },
  { id: "education", title: "Education", note: "Shaping minds requires human wisdom" },
  { id: "marketing", title: "Marketing & Creative", note: "Creativity can't be automated" },
  { id: "legal", title: "Legal & Professional", note: "Judgment requires human experience" },
  { id: "real-estate", title: "Real Estate", note: "Relationships drive everything" },
  { id: "government", title: "Government & Non-profit", note: "Mission-driven work needs heart" },
  { id: "other", title: "Other", note: "Your unique perspective matters" },
]

export function AIIndustryWorldQuestion({ onNext, onPrev, onUpdate, currentValue }: AIIndustryWorldQuestionProps) {
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

  const selectedIndustry = industries.find((industry) => industry.id === selected)

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
        <div className="text-lg font-bold">Career OS</div>
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
              Every industry faces unique AI challenges. Which world do you navigate daily?
            </p>
            <p className="text-sm text-blue-600 italic">
              Your industry expertise is irreplaceable - AI should amplify it, not threaten it
            </p>
          </div>

          {!showResponse ? (
            /* Options */
            <div className="space-y-3">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => handleSelection(industry.id)}
                  className="w-full p-4 rounded-lg text-left transition-all border-2 border-gray-200 bg-white hover:border-gray-300"
                >
                  <div>
                    <p className="font-medium text-gray-900 mb-1">{industry.title}</p>
                    <p className="text-sm text-gray-600 italic">({industry.note})</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Empathetic Response */
            <div className="space-y-6">
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-900 font-medium text-center">
                  We're tracking how AI is reshaping {selectedIndustry?.title} so you don't have to worry alone. Your
                  free weekly {selectedIndustry?.title} AI Digest will help you stay confidently informed, not anxiously
                  behind.
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

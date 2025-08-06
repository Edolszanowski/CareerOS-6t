"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AIRoleQuestionProps {
  onNext: () => void
  onPrev: () => void
  onUpdate: (value: { role: string; function: string }) => void
  currentValue?: { role: string; function: string }
}

const roles = [
  { id: "executive", title: "Executive Leadership", note: "The human vision AI can't replace" },
  { id: "management", title: "Management", note: "Leading humans requires humanity" },
  { id: "senior", title: "Senior Professional", note: "Your expertise took years to build" },
  { id: "mid-level", title: "Mid-Level Professional", note: "Your growth trajectory matters" },
  { id: "early-career", title: "Early Career", note: "You're building future-proof foundations" },
  { id: "freelance", title: "Freelance/Consultant", note: "Independence is your superpower" },
  { id: "business-owner", title: "Business Owner", note: "Your vision drives everything" },
  { id: "student", title: "Student/Career Transition", note: "Courage to change is powerful" },
]

const functions = [
  "Strategy & Planning",
  "Operations & Process",
  "Sales & Business Development",
  "Marketing & Communications",
  "Product & Innovation",
  "Technology & Engineering",
  "Finance & Analysis",
  "Human Resources",
  "Customer Success",
  "Other",
]

export function AIRoleQuestion({ onNext, onPrev, onUpdate, currentValue }: AIRoleQuestionProps) {
  const [selectedRole, setSelectedRole] = useState(currentValue?.role || "")
  const [selectedFunction, setSelectedFunction] = useState(currentValue?.function || "")
  const [showFunctionStep, setShowFunctionStep] = useState(false)
  const [showResponse, setShowResponse] = useState(false)

  const handleRoleSelection = (id: string) => {
    setSelectedRole(id)
    setShowFunctionStep(true)
  }

  const handleFunctionSelection = (func: string) => {
    setSelectedFunction(func)
    setShowResponse(true)
  }

  const handleContinue = () => {
    if (selectedRole && selectedFunction) {
      onUpdate({ role: selectedRole, function: selectedFunction })
      onNext()
    }
  }

  const selectedRoleData = roles.find((role) => role.id === selectedRole)

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
            <div className="text-xs text-gray-500">Question 3 of 8</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-black h-1 transition-all duration-300" style={{ width: "37.5%" }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Honoring Your Role</h1>
            <p className="text-gray-600">
              Your role brings unique value. Help us understand what you do so we can support you better
            </p>
            <p className="text-sm text-blue-600 italic">
              Every role has irreplaceable human elements - let's amplify yours
            </p>
          </div>

          {!showFunctionStep && !showResponse ? (
            /* Role Selection */
            <div className="space-y-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelection(role.id)}
                  className="w-full p-4 rounded-lg text-left transition-all border-2 border-gray-200 bg-white hover:border-gray-300"
                >
                  <div>
                    <p className="font-medium text-gray-900 mb-1">{role.title}</p>
                    <p className="text-sm text-gray-600 italic">({role.note})</p>
                  </div>
                </button>
              ))}
            </div>
          ) : !showResponse ? (
            /* Function Selection */
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-700">What does your day-to-day focus on?</p>
                <p className="text-sm text-gray-500 italic">
                  (We ask because different functions need different support)
                </p>
              </div>
              <div className="space-y-3">
                {functions.map((func) => (
                  <button
                    key={func}
                    onClick={() => handleFunctionSelection(func)}
                    className="w-full p-3 rounded-lg text-left transition-all border-2 border-gray-200 bg-white hover:border-gray-300"
                  >
                    <p className="font-medium text-gray-900">{func}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Empathetic Response */
            <div className="space-y-6">
              <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-purple-900 font-medium text-center">
                  As a {selectedRoleData?.title} in {selectedFunction}, you bring irreplaceable human value. Your Monday
                  playbook will show you exactly how to amplify these strengths, not replace them.
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

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useOnboarding } from "@/contexts/onboarding-context"

interface AIRoleQuestionProps {
  onNext: () => void
  onPrev: () => void
}

const roleOptions = [
  {
    id: "executive",
    title: "Executive Leadership",
    note: "The human vision AI can't replace"
  },
  {
    id: "management",
    title: "Management",
    note: "Leading humans requires humanity"
  },
  {
    id: "senior",
    title: "Senior Professional",
    note: "Your expertise took years to build"
  },
  {
    id: "mid-level",
    title: "Mid-Level Professional",
    note: "Your growth trajectory matters"
  },
  {
    id: "early-career",
    title: "Early Career",
    note: "You're building future-proof foundations"
  },
  {
    id: "freelance",
    title: "Freelance/Consultant",
    note: "Independence is your superpower"
  },
  {
    id: "business-owner",
    title: "Business Owner",
    note: "Your vision drives everything"
  },
  {
    id: "student",
    title: "Student/Career Transition",
    note: "Courage to change is powerful"
  }
]

const functionOptions = [
  "Strategy & Planning",
  "Operations & Management",
  "Sales & Business Development",
  "Marketing & Communications",
  "Product & Innovation",
  "Technology & Engineering",
  "Finance & Analytics",
  "Human Resources",
  "Customer Success",
  "Creative & Design",
  "Legal & Compliance",
  "Other"
]

export function AIRoleQuestion({ onNext, onPrev }: AIRoleQuestionProps) {
  const { updateUserData, userData } = useOnboarding()
  const [selectedRole, setSelectedRole] = useState(userData.role || "")
  const [selectedFunction, setSelectedFunction] = useState(userData.function || "")
  const [step, setStep] = useState(1) // 1 for role, 2 for function
  const [showResponse, setShowResponse] = useState(false)

  const handleRoleSelection = (id: string) => {
    setSelectedRole(id)
    updateUserData({ role: id })
    setStep(2)
  }

  const handleFunctionSelection = (func: string) => {
    setSelectedFunction(func)
    updateUserData({ function: func })
    setShowResponse(true)
    
    // Auto-advance after 5 seconds (increased from 2 seconds)
    setTimeout(() => {
      onNext()
    }, 5000)
  }

  const selectedRoleOption = roleOptions.find((option) => option.id === selectedRole)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={step === 1 ? onPrev : () => setStep(1)} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="text-sm font-medium text-gray-900">AI Preparedness Assessment</div>
            <div className="text-xs text-gray-500">Question 3 of 8</div>
          </div>
        </div>
        <div className="text-lg font-bold">CareerOS</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-black h-1 transition-all duration-300" style={{ width: "37.5%" }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {step === 1 && !showResponse && (
            <>
              <div className="text-center space-y-4">
                <h1 className="text-xl font-bold text-gray-900">Honoring Your Role</h1>
                <p className="text-gray-600">
                  Your role brings unique value. Help us understand what you do so we can support you better (and send you role-specific strategies every Monday)
                </p>
                <p className="text-sm text-blue-600 italic">
                  Every role has irreplaceable human elements - let's amplify yours
                </p>
              </div>

              <div className="space-y-3">
                {roleOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleRoleSelection(option.id)}
                    className="w-full p-4 rounded-lg text-left transition-all border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  >
                    <p className="font-medium text-gray-900">{option.title}</p>
                    <p className="text-sm text-gray-500 mt-1">({option.note})</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && !showResponse && (
            <>
              <div className="text-center space-y-4">
                <h1 className="text-xl font-bold text-gray-900">Function Deep-Dive</h1>
                <p className="text-gray-600">
                  What does your day-to-day focus on? (We ask because different functions need different support)
                </p>
              </div>

              <div className="space-y-3">
                {functionOptions.map((func) => (
                  <button
                    key={func}
                    onClick={() => handleFunctionSelection(func)}
                    className="w-full p-4 rounded-lg text-left transition-all border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  >
                    <p className="font-medium text-gray-900">{func}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {showResponse && (
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-900 font-medium text-center">
                  As a {selectedRoleOption?.title} in {selectedFunction}, you bring specific human value. Your Monday playbook will show you exactly how to amplify these strengths, not replace them.
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

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, User, Building2 } from 'lucide-react'
import { useOnboarding } from "@/contexts/onboarding-context"

interface UserTypeQuestionProps {
  onNext: () => void
  onPrev: () => void
}

export function UserTypeQuestion({ onNext, onPrev }: UserTypeQuestionProps) {
  const { updateUserData, userData } = useOnboarding()
  const [selected, setSelected] = useState(userData.userType || "")

  const handleSelection = (type: string) => {
    setSelected(type)
    updateUserData({ userType: type })
    
    // Auto-advance after selection
    setTimeout(() => {
      onNext()
    }, 1000)
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
            <div className="text-sm font-medium text-gray-900">Getting Started</div>
            <div className="text-xs text-gray-500">Choose your path</div>
          </div>
        </div>
        <div className="text-lg font-bold">CareerOS</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Which path describes you best?
            </h1>
            <p className="text-lg text-gray-600">
              This helps us personalize your experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className={`cursor-pointer transition-all border-2 hover:shadow-lg ${
                selected === 'professional' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelection('professional')}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  I'm a Professional
                </h3>
                <p className="text-gray-600">
                  Looking to advance my career and stay competitive in the AI era
                </p>
                {selected === 'professional' && (
                  <div className="text-blue-600 font-medium">Selected ✓</div>
                )}
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all border-2 hover:shadow-lg ${
                selected === 'employer' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelection('employer')}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Building2 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  I'm an Employer
                </h3>
                <p className="text-gray-600">
                  Looking to upskill my team and implement AI in my organization
                </p>
                {selected === 'employer' && (
                  <div className="text-purple-600 font-medium">Selected ✓</div>
                )}
              </CardContent>
            </Card>
          </div>

          {selected && (
            <div className="text-center">
              <div className="animate-pulse text-sm text-gray-500">
                Continuing to assessment...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useOnboarding } from "@/contexts/onboarding-context"

const steps = [
  { id: 1, name: "Welcome", type: "intro" },
  { id: 2, name: "User Type", type: "question" },
  { id: 3, name: "Tools", type: "question" },
  { id: 4, name: "Career Stage", type: "question" },
  { id: 5, name: "Goals", type: "question" },
  { id: 6, name: "Challenges", type: "question" },
  { id: 7, name: "Insights", type: "value" },
  { id: 8, name: "Save Results", type: "signup" },
  { id: 9, name: "Complete", type: "complete" },
]

export function ProgressIndicator() {
  const { currentStep, userData } = useOnboarding()

  // Don't show on welcome, completion screens, or employer flow
  if (currentStep === 1 || currentStep === 9 || userData.userType === "employer") {
    return null
  }

  const progress = ((currentStep - 1) / (steps.length - 2)) * 100
  const questionsRemaining = Math.max(0, 7 - currentStep)

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-900">
            Step {currentStep - 1} of {steps.length - 2}
          </div>
          <div className="text-sm text-gray-600">
            {questionsRemaining > 0
              ? `${questionsRemaining} questions left`
              : currentStep === 7
                ? "Your insights are ready!"
                : "Almost done!"}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mt-3">
          {steps.slice(1, -1).map((step) => {
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    isCompleted ? "bg-black" : isCurrent ? "bg-gray-400 ring-2 ring-gray-200" : "bg-gray-300"
                  }`}
                />
                <span
                  className={`text-xs mt-1 ${isCompleted || isCurrent ? "text-black font-medium" : "text-gray-400"}`}
                >
                  {step.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

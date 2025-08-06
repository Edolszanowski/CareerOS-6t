"use client"

import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Clock } from "lucide-react"

export function WelcomeScreen() {
  const { nextStep } = useOnboarding()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-black rounded-full"></div>
          <div>
            <div className="text-sm font-medium text-gray-900">Career Strategy Builder</div>
            <div className="text-xs text-gray-500">Step 1 of 3 • Takes 2-3 minutes</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Here is how it works</h1>
            <p className="text-gray-600">
              Career guidance built for professionals who feel overwhelmed by endless advice and want a clear,
              personalized path forward.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Understand your unique situation</h3>
                <p className="text-sm text-gray-600">
                  Answer a few quick questions about your career stage, goals, and biggest challenges. We know
                  everyone's path is different.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Get insights that actually apply to you</h3>
                <p className="text-sm text-gray-600">
                  See personalized recommendations based on your specific situation, not generic career advice that
                  doesn't fit your life.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Build your strategy together</h3>
                <p className="text-sm text-gray-600">
                  We'll create a personalized action plan that you can actually follow, designed around your goals and
                  constraints. You're in control.
                </p>
              </div>
            </div>
          </div>

          {/* Value proposition */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center space-x-2 text-blue-800 mb-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium text-sm">Why this works better</span>
            </div>
            <p className="text-sm text-blue-700">
              Instead of overwhelming you with generic advice, we focus on your specific situation and create a plan
              that actually fits your life and career stage.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <Button
            onClick={nextStep}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium"
          >
            Continue to assessment
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            No signup required • See your personalized insights first
          </p>
        </div>
      </div>
    </div>
  )
}

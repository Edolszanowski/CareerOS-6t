"use client"

import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ArrowLeft, Users, Target, TrendingUp, Award } from "lucide-react"

export function EmployerWelcome() {
  const { prevStep } = useOnboarding()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={prevStep} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="text-sm font-medium text-gray-900">Career OS for Teams</div>
            <div className="text-xs text-gray-500">Coming Soon</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Career OS for Teams</h1>
            <p className="text-gray-600">
              Help your team members grow their careers with personalized development plans, skills assessments, and
              career pathing tools.
            </p>
          </div>

          {/* Features Preview */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Team Development Plans</h3>
                <p className="text-sm text-gray-600">Create personalized growth paths for each team member</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Skills Gap Analysis</h3>
                <p className="text-sm text-gray-600">Identify and address skill gaps across your organization</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Award className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Performance Insights</h3>
                <p className="text-sm text-gray-600">Track career progression and development outcomes</p>
              </div>
            </div>
          </div>

          {/* Coming Soon Message */}
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200 text-center">
            <h3 className="font-semibold text-purple-900 mb-2">Coming Soon</h3>
            <p className="text-sm text-purple-700 mb-4">
              We're building something special for managers, HR professionals, and team leaders. Be the first to know
              when it's ready.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your work email"
                className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Get Early Access</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-6 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <Button onClick={prevStep} variant="outline" className="w-full py-4 text-base font-medium bg-transparent">
            Back to User Type Selection
          </Button>
        </div>
      </div>
    </div>
  )
}

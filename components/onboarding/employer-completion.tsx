"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useOnboarding } from "@/contexts/onboarding-context"
import { CheckCircle, Mail, BookOpen, Users, Calendar } from "lucide-react"

export function EmployerCompletion() {
  const { userData } = useOnboarding()

  const hasNewsletterInterest = userData.employerTools?.includes("industry-updates")
  const hasTrainingInterest = userData.employerTools?.some((tool: string) =>
    ["career-guidance", "hr-leadership"].includes(tool),
  )
  const hasRecruitmentInterest = userData.employerTools?.includes("qualified-employees")

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div>
          <div className="text-sm font-medium text-gray-900">Career OS for Teams</div>
          <div className="text-xs text-gray-500">Welcome aboard!</div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h1 className="text-2xl font-bold text-gray-900">You're all set!</h1>
                <p className="text-gray-600">
                  Thank you for your interest in Career OS for Teams. We're excited to help you develop your team's
                  potential.
                </p>
              </div>

              {/* Personalized next steps */}
              <div className="space-y-4 text-left">
                <h3 className="font-semibold text-gray-900 text-center">What's coming your way:</h3>

                {hasNewsletterInterest && (
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Industry Updates</p>
                      <p className="text-sm text-blue-700">Weekly insights delivered to your inbox</p>
                    </div>
                  </div>
                )}

                {hasTrainingInterest && (
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Training Resources</p>
                      <p className="text-sm text-green-700">Curated development materials for your team</p>
                    </div>
                  </div>
                )}

                {hasRecruitmentInterest && (
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-purple-900">Talent Pipeline</p>
                      <p className="text-sm text-purple-700">Access to qualified candidates</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Early Access</p>
                    <p className="text-sm text-gray-700">First to know when Career OS for Teams launches</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => (window.location.href = "mailto:hello@careeros.com")}
                  className="w-full bg-black hover:bg-gray-800"
                >
                  Contact Us for Custom Solutions
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Need something specific? We'd love to discuss your team's unique needs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

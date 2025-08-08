"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Mail, Calendar, Users } from 'lucide-react'
import { useOnboarding } from "@/contexts/onboarding-context"

interface CompletionScreenProps {
  onNext?: () => void
}

export function CompletionScreen({ onNext }: CompletionScreenProps) {
  const { userData } = useOnboarding()

  const handleGoToDashboard = () => {
    // Navigate to dashboard
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="text-lg font-bold text-gray-900">CareerOS</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Welcome Message */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Welcome to Your AI Journey, {userData.firstName}!
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your personalized AI success plan is ready. You're now part of a community of 10,000+ professionals transforming their careers with confidence.
            </p>
          </div>

          {/* What's Next */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-left">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Check Your Email</h3>
                    <p className="text-gray-600 text-sm">Your detailed AI readiness report is waiting in your inbox</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Weekly AI Insights</h3>
                    <p className="text-gray-600 text-sm">Receive tailored {userData.industry} insights every Monday</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Join the Community</h3>
                    <p className="text-gray-600 text-sm">Connect with professionals on similar journeys</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="space-y-4">
            <Button 
              onClick={handleGoToDashboard}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium"
            >
              View Your Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-sm text-gray-500">
              Your journey to AI mastery starts now
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

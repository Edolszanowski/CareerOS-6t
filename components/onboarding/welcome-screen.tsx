"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Clock, Users, Target } from 'lucide-react'

interface WelcomeScreenProps {
  onNext: () => void
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="text-lg font-bold text-gray-900">CareerOS</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Discover Your AI Readiness Score
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Take our 8-question assessment to understand exactly where you stand with AI and get your personalized roadmap to success.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">3 Minutes</h3>
                <p className="text-sm text-gray-600">Quick assessment designed for busy professionals</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Personalized</h3>
                <p className="text-sm text-gray-600">Tailored insights based on your industry and role</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Proven</h3>
                <p className="text-sm text-gray-600">Join 10,000+ professionals already transforming their careers</p>
              </CardContent>
            </Card>
          </div>

          {/* Social Proof */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6">
            <p className="text-gray-700 italic mb-4">
              "This assessment gave me clarity on exactly where I stood with AI and a clear path forward. Within 3 months, I was leading AI initiatives at my company."
            </p>
            <p className="text-sm text-gray-600">— Sarah Chen, Marketing Director</p>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Button 
              onClick={onNext}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium"
            >
              Start Your Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-sm text-gray-500">
              Free • No email required to start • Results in 3 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

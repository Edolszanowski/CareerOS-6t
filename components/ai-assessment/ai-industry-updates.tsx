"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Mail, TrendingUp, Brain, Zap } from "lucide-react"

interface AIIndustryUpdatesProps {
  onNext: () => void
  onPrev: () => void
}

const industryUpdates = [
  {
    id: "ai-automation",
    title: "AI Automation in Your Industry",
    description: "Latest trends in AI-powered automation and efficiency tools",
    icon: Zap,
  },
  {
    id: "ai-skills",
    title: "Essential AI Skills Development",
    description: "Key competencies professionals need to stay competitive",
    icon: Brain,
  },
  {
    id: "ai-tools",
    title: "New AI Tools & Platforms",
    description: "Cutting-edge AI tools relevant to your role and industry",
    icon: TrendingUp,
  },
  {
    id: "ai-case-studies",
    title: "AI Success Stories",
    description: "Real-world examples of AI implementation and ROI",
    icon: Mail,
  },
]

export function AIIndustryUpdates({ onNext, onPrev }: AIIndustryUpdatesProps) {
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
            <div className="text-xs text-gray-500">Industry Updates</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Thank you, here is your latest industry update</h1>
            <p className="text-gray-600">
              Based on your assessment, here are the most relevant AI developments for your industry and role.
            </p>
          </div>

          {/* Industry Updates */}
          <div className="space-y-4">
            {industryUpdates.map((update) => {
              const Icon = update.icon
              return (
                <Card key={update.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{update.title}</h3>
                        <p className="text-sm text-gray-600">{update.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Value Proposition */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 text-green-800 mb-2">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Stay Updated</span>
            </div>
            <p className="text-sm text-green-700">
              We'll send you weekly updates on AI developments specific to your industry and career level, so you never
              miss important changes that could impact your role.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <Button onClick={onNext} className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium">
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

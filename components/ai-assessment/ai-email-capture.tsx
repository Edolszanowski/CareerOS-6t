"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Shield } from 'lucide-react'
import { saveAIAssessment, subscribeToNewsletters } from "@/actions/ai-assessment-actions"

interface AIEmailCaptureProps {
  onNext: () => void
  onPrev: () => void
  responses: any
  userId?: number
}

export function AIEmailCapture({ onNext, onPrev, responses, userId }: AIEmailCaptureProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // 1. Save assessment with calculated score
      const result = await saveAIAssessment({
        ...responses,
        email,
        user_id: userId ? parseInt(userId.toString()) : undefined
      })

      if (result.success) {
        // 2. Subscribe to newsletters based on role and industry
        if (result.user_id) {
          await subscribeToNewsletters(result.user_id, {
            role: responses.question_3b_role_title,
            industry: responses.question_2_industry
          })
        }

        // 3. Continue to next step instead of redirecting
        onNext()
      } else {
        setError(result.error || "Failed to save assessment")
      }
    } catch (error) {
      console.error("Error saving assessment:", error)
      setError("Failed to save assessment. Please try again.")
    }

    setIsLoading(false)
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
            <div className="text-sm font-medium text-gray-900">AI Preparedness Assessment</div>
            <div className="text-xs text-gray-500">Save Your Results</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Save your assessment results and get personalized AI updates
            </h1>
            <p className="text-gray-600">
              We'll send you industry-specific AI insights based on your role as a {responses.question_3b_role_title} in {responses.question_2_industry}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="mt-1"
              />
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Your information is secure and never shared</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Get {responses.question_2_industry} AI updates tailored to your role</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-blue-700">
                <strong>What you'll receive:</strong> Your detailed assessment report (AI Readiness Score: {Math.round((responses.question_5_automation_pct || 50) * 0.8)}%), personalized learning recommendations, and weekly AI updates for {responses.question_3b_role_title} professionals in {responses.question_2_industry}.
              </p>
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

            <Button
              type="submit"
              disabled={!email || isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white py-4 text-base font-medium disabled:bg-gray-300"
            >
              {isLoading ? "Saving your results..." : "Save Results & Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

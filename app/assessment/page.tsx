'use client'

import { CareerReadinessForm } from "@/components/assessment/career-readiness-form"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { OnboardingProvider } from '@/contexts/onboarding-context'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'

export default function AssessmentPage() {
  const router = useRouter()

  const handleComplete = async (responses: any[], score: number) => {
    try {
      // Save assessment to API
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Replace with actual user ID
          ...responses.reduce((acc, response) => {
            acc[`question_${response.questionId}`] = response.value
            return acc
          }, {})
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Assessment completed successfully!')
        router.push(`/dashboard?score=${result.ai_readiness_score}`)
      } else {
        throw new Error('Failed to save assessment')
      }
    } catch (error) {
      console.error('Error completing assessment:', error)
      toast.error('Failed to save assessment. Please try again.')
    }
  }

  const handleSave = (responses: any[]) => {
    console.log('Saving responses:', responses)
    router.push('/dashboard')
  }

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Career Readiness Assessment
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover your career strengths and areas for growth with our comprehensive 8-question assessment. 
              Get personalized insights and actionable recommendations for your career development.
            </p>
          </div>

          <CareerReadinessForm 
            onComplete={handleComplete}
            onSave={handleSave}
          />
          <OnboardingFlow />
        </div>
      </div>
    </OnboardingProvider>
  )
}

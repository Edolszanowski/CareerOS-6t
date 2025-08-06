import { CareerReadinessForm } from "@/components/assessment/career-readiness-form"

export default function AssessmentPage() {
  const handleComplete = (responses: any[], score: number) => {
    console.log('Assessment completed:', { responses, score })
    // Handle completion - save to database, redirect, etc.
  }

  const handleSave = (responses: any[]) => {
    console.log('Saving responses:', responses)
    // Handle saving responses and redirecting to career plan
  }

  return (
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
      </div>
    </div>
  )
}

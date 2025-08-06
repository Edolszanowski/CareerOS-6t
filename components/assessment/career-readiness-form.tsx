"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, CheckCircle, Target, TrendingUp } from 'lucide-react'

interface AssessmentQuestion {
  id: number
  title: string
  subtitle?: string
  type: 'radio' | 'textarea' | 'scale'
  options?: { value: string; label: string; description?: string }[]
  placeholder?: string
  scaleMin?: number
  scaleMax?: number
  scaleLabels?: { min: string; max: string }
}

interface AssessmentResponse {
  questionId: number
  value: string | number
}

const questions: AssessmentQuestion[] = [
  {
    id: 1,
    title: "What is your current career stage?",
    subtitle: "This helps us understand your unique challenges and opportunities",
    type: 'radio',
    options: [
      { value: 'recent-grad', label: 'Recent Graduate (0-2 years)', description: 'Just starting my career journey' },
      { value: 'early-career', label: 'Early Career (2-5 years)', description: 'Building experience and skills' },
      { value: 'mid-career', label: 'Mid-Career (5-10 years)', description: 'Established with growth ambitions' },
      { value: 'senior-career', label: 'Senior Professional (10+ years)', description: 'Experienced leader or specialist' },
      { value: 'career-change', label: 'Career Transition', description: 'Changing fields or industries' }
    ]
  },
  {
    id: 2,
    title: "How clear are you about your career goals?",
    subtitle: "Understanding your direction helps us provide better guidance",
    type: 'radio',
    options: [
      { value: 'very-clear', label: 'Very Clear', description: 'I have specific, well-defined goals' },
      { value: 'somewhat-clear', label: 'Somewhat Clear', description: 'I have general direction but need specifics' },
      { value: 'exploring', label: 'Still Exploring', description: 'I\'m figuring out what I want' },
      { value: 'unclear', label: 'Unclear', description: 'I need help defining my goals' }
    ]
  },
  {
    id: 3,
    title: "How would you rate your current skill development?",
    subtitle: "Are you actively building skills relevant to your career goals?",
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    scaleLabels: { min: 'Not developing skills', max: 'Actively learning new skills' }
  },
  {
    id: 4,
    title: "How strong is your professional network?",
    subtitle: "Networking is crucial for career advancement and opportunities",
    type: 'radio',
    options: [
      { value: 'strong', label: 'Strong Network', description: 'I have many professional connections' },
      { value: 'moderate', label: 'Moderate Network', description: 'I have some professional connections' },
      { value: 'limited', label: 'Limited Network', description: 'I have few professional connections' },
      { value: 'minimal', label: 'Minimal Network', description: 'I need to build my network from scratch' }
    ]
  },
  {
    id: 5,
    title: "How confident are you in your ability to adapt to industry changes?",
    subtitle: "Industries evolve rapidly - adaptability is key to career resilience",
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    scaleLabels: { min: 'Not confident', max: 'Very confident' }
  },
  {
    id: 6,
    title: "What is your biggest career challenge right now?",
    subtitle: "Understanding your main obstacle helps us prioritize solutions",
    type: 'radio',
    options: [
      { value: 'skill-gaps', label: 'Skill Gaps', description: 'I lack certain technical or soft skills' },
      { value: 'career-direction', label: 'Career Direction', description: 'I\'m unsure about my next steps' },
      { value: 'work-life-balance', label: 'Work-Life Balance', description: 'Struggling to balance career and personal life' },
      { value: 'advancement', label: 'Career Advancement', description: 'Not progressing as fast as I\'d like' },
      { value: 'industry-changes', label: 'Industry Changes', description: 'Keeping up with rapid changes in my field' },
      { value: 'networking', label: 'Professional Networking', description: 'Building meaningful professional relationships' }
    ]
  },
  {
    id: 7,
    title: "How proactive are you in seeking career development opportunities?",
    subtitle: "Taking initiative is crucial for career growth",
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    scaleLabels: { min: 'Very passive', max: 'Very proactive' }
  },
  {
    id: 8,
    title: "What specific support would be most valuable for your career right now?",
    subtitle: "Help us understand how we can best assist your career development",
    type: 'textarea',
    placeholder: 'Describe the type of support, guidance, or resources that would be most helpful for your career development...'
  }
]

interface CareerReadinessFormProps {
  onComplete?: (responses: AssessmentResponse[], score: number) => void
  onSave?: (responses: AssessmentResponse[]) => void
}

export function CareerReadinessForm({ onComplete, onSave }: CareerReadinessFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<AssessmentResponse[]>([])
  const [currentValue, setCurrentValue] = useState<string | number>('')
  const [isCompleted, setIsCompleted] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const question = questions[currentQuestion]

  const updateResponse = (value: string | number) => {
    setCurrentValue(value)
    const newResponses = responses.filter(r => r.questionId !== question.id)
    newResponses.push({ questionId: question.id, value })
    setResponses(newResponses)
  }

  const getCurrentResponse = () => {
    const response = responses.find(r => r.questionId === question.id)
    return response?.value || ''
  }

  const canProceed = () => {
    if (question.type === 'textarea') {
      return currentValue.toString().trim().length > 0
    }
    return currentValue !== ''
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentValue(getCurrentResponse())
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setCurrentValue(getCurrentResponse())
    }
  }

  const calculateScore = (responses: AssessmentResponse[]): number => {
    let totalScore = 0
    let maxScore = 0

    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId)
      if (!question) return

      if (question.type === 'scale') {
        totalScore += Number(response.value)
        maxScore += question.scaleMax || 10
      } else if (question.type === 'radio') {
        // Assign scores based on career readiness indicators
        const scoreMap: Record<string, number> = {
          'very-clear': 10, 'somewhat-clear': 7, 'exploring': 5, 'unclear': 3,
          'strong': 10, 'moderate': 7, 'limited': 5, 'minimal': 3,
          'recent-grad': 6, 'early-career': 7, 'mid-career': 8, 'senior-career': 9, 'career-change': 6,
          'skill-gaps': 5, 'career-direction': 4, 'work-life-balance': 6, 'advancement': 7, 'industry-changes': 6, 'networking': 5
        }
        totalScore += scoreMap[response.value as string] || 5
        maxScore += 10
      } else if (question.type === 'textarea') {
        // Score based on response length and thoughtfulness
        const length = response.value.toString().length
        totalScore += Math.min(10, Math.max(3, length / 20))
        maxScore += 10
      }
    })

    return Math.round((totalScore / maxScore) * 100)
  }

  const handleComplete = () => {
    const score = calculateScore(responses)
    setIsCompleted(true)
    onComplete?.(responses, score)
  }

  if (isCompleted) {
    const score = calculateScore(responses)
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Assessment Complete!</h2>
            <p className="text-gray-600">
              Thank you for completing the Career Readiness Assessment. Here's your result:
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-center space-x-4">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-3xl font-bold text-blue-900">{score}/100</div>
                <div className="text-sm text-blue-700">Career Readiness Score</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-left">
            <h3 className="font-semibold text-gray-900 text-center">What this means:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {score >= 80 && (
                <p className="p-3 bg-green-50 rounded-lg text-green-800">
                  <strong>Excellent:</strong> You're well-positioned for career success with strong foundations and clear direction.
                </p>
              )}
              {score >= 60 && score < 80 && (
                <p className="p-3 bg-blue-50 rounded-lg text-blue-800">
                  <strong>Good:</strong> You have solid career foundations with some areas for improvement and growth.
                </p>
              )}
              {score >= 40 && score < 60 && (
                <p className="p-3 bg-yellow-50 rounded-lg text-yellow-800">
                  <strong>Developing:</strong> You're on the right track but would benefit from focused career development efforts.
                </p>
              )}
              {score < 40 && (
                <p className="p-3 bg-orange-50 rounded-lg text-orange-800">
                  <strong>Needs Attention:</strong> There are several areas where focused career development could significantly help your progress.
                </p>
              )}
            </div>
          </div>

          <Button 
            onClick={() => onSave?.(responses)}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Get Personalized Career Plan
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg">Career Readiness Assessment</CardTitle>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.title}</CardTitle>
          {question.subtitle && (
            <p className="text-gray-600">{question.subtitle}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Radio Options */}
          {question.type === 'radio' && (
            <RadioGroup
              value={currentValue.toString()}
              onValueChange={updateResponse}
              className="space-y-3"
            >
              {question.options?.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    {option.description && (
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Scale Input */}
          {question.type === 'scale' && (
            <div className="space-y-4">
              <div className="px-4">
                <input
                  type="range"
                  min={question.scaleMin}
                  max={question.scaleMax}
                  value={currentValue || question.scaleMin}
                  onChange={(e) => updateResponse(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{question.scaleLabels?.min}</span>
                  <span className="font-medium text-lg text-gray-900">{currentValue || question.scaleMin}</span>
                  <span>{question.scaleLabels?.max}</span>
                </div>
              </div>
            </div>
          )}

          {/* Textarea Input */}
          {question.type === 'textarea' && (
            <Textarea
              value={currentValue.toString()}
              onChange={(e) => updateResponse(e.target.value)}
              placeholder={question.placeholder}
              rows={4}
              className="resize-none"
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700"
        >
          <span>{currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}

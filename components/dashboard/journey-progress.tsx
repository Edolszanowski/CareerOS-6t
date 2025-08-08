'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, Clock } from 'lucide-react'

interface Stage {
  id: number
  name: string
  description: string
  completed: boolean
  completedAt: string | null
  current: boolean
}

interface JourneyData {
  user: {
    id: number
    email: string
    jobTitle: string
  }
  assessment: {
    completed: boolean
    score: number
    familiarity: string
    understandingLevel: string
    completedAt: string
  }
  journey: {
    currentStage: number
    stages: Stage[]
    completedStages: number
    totalStages: number
    progressPercentage: number
    createdAt: string
    updatedAt: string
  }
}

interface JourneyProgressProps {
  userId: number
}

export function JourneyProgress({ userId }: JourneyProgressProps) {
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user-journey/${userId}`)
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch journey data')
        }
        
        if (result.success) {
          setJourneyData(result.data)
        } else {
          throw new Error(result.error || 'Invalid response format')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        console.error('Error fetching journey data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchJourneyData()
    }
  }, [userId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Journey Progress</CardTitle>
          <CardDescription>Loading your progress...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Journey Progress</CardTitle>
          <CardDescription>Error loading progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            <p className="font-medium">Unable to load journey data</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!journeyData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Journey Progress</CardTitle>
          <CardDescription>No journey data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Please complete your assessment to begin your AI journey.</p>
        </CardContent>
      </Card>
    )
  }

  const { user, assessment, journey } = journeyData

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Journey Progress</CardTitle>
        <CardDescription>
          {user.jobTitle && `${user.jobTitle} • `}
          Stage {journey.currentStage} of {journey.totalStages}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{journey.progressPercentage}% Complete</span>
          </div>
          <Progress value={journey.progressPercentage} className="h-2" />
        </div>

        {/* Assessment Summary */}
        {assessment.completed && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">AI Readiness Score</p>
                <p className="text-sm text-blue-700">
                  {assessment.familiarity} • {assessment.understandingLevel}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">{assessment.score}</div>
                <div className="text-sm text-blue-700">out of 100</div>
              </div>
            </div>
          </div>
        )}

        {/* Stage Progress */}
        <div className="space-y-3">
          <h4 className="font-medium">Journey Stages</h4>
          {journey.stages.map((stage) => (
            <div
              key={stage.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                stage.current
                  ? 'border-blue-200 bg-blue-50'
                  : stage.completed
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex-shrink-0">
                {stage.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : stage.current ? (
                  <Clock className="h-5 w-5 text-blue-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center space-x-2">
                  <h5 className="font-medium">{stage.name}</h5>
                  {stage.current && (
                    <Badge variant="outline" className="text-xs">
                      Current
                    </Badge>
                  )}
                  {stage.completed && (
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                      Complete
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{stage.description}</p>
                {stage.completedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Completed {new Date(stage.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Journey Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{journey.completedStages}</div>
            <div className="text-sm text-gray-600">Stages Complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{journey.totalStages - journey.completedStages}</div>
            <div className="text-sm text-gray-600">Stages Remaining</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

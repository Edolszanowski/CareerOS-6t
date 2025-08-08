'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { RefreshCw, Database, Users, FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface HealthData {
  success: boolean
  timestamp: string
  summary: {
    totalUsers: number
    totalProfiles: number
    totalAssessments: number
    totalJourneyRecords: number
  }
  relationships: {
    assessmentUserLinks: number
    journeyUserLinks: number
    profileUserLinks: number
  }
  dataQuality: {
    orphanedAssessments: number
    orphanedJourneys: number
    emptyProfiles: number
  }
  sampleData: {
    users: Array<{ id: number; email: string; name: string }>
    assessments: Array<{ id: number; email: string; ai_readiness_score: number; question_1_journey: string }>
    journeys: Array<{ id: number; user_id: number; current_stage: number; stage_1_completed: boolean }>
  }
  issues: string[]
}

export function DatabaseHealthChecker() {
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHealthData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/database-health')
      const data = await response.json()
      
      if (data.success) {
        setHealthData(data)
      } else {
        setError(data.error || 'Failed to fetch health data')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthData()
  }, [])

  const getHealthStatus = () => {
    if (!healthData) return 'unknown'
    if (healthData.issues.length === 0) return 'healthy'
    if (healthData.issues.length <= 2) return 'warning'
    return 'critical'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />
      default: return <Database className="h-5 w-5 text-gray-600" />
    }
  }

  if (error) {
    return (
      <Alert className="border-red-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Database health check failed: {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchHealthData}
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const status = getHealthStatus()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon(status)}
          <h2 className="text-2xl font-bold">Database Health Monitor</h2>
          <Badge variant={status === 'healthy' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'}>
            {status.toUpperCase()}
          </Badge>
        </div>
        <Button 
          onClick={fetchHealthData} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {healthData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.summary.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assessments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.summary.totalAssessments}</div>
                <p className="text-xs text-muted-foreground">Completed assessments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Journey Records</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.summary.totalJourneyRecords}</div>
                <p className="text-xs text-muted-foreground">User progress tracking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Profiles</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.summary.totalProfiles}</div>
                <p className="text-xs text-muted-foreground">Profile records</p>
              </CardContent>
            </Card>
          </div>

          {/* Issues Alert */}
          {healthData.issues.length > 0 && (
            <Alert className="border-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Database Issues Detected:</div>
                <ul className="list-disc list-inside space-y-1">
                  {healthData.issues.map((issue, index) => (
                    <li key={index} className="text-sm">{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Data Quality Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Data Quality Metrics</CardTitle>
              <CardDescription>Relationship integrity and data completeness</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Assessment Links</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {healthData.relationships.assessmentUserLinks}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Valid user connections
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Journey Links</div>
                  <div className="text-2xl font-bold text-green-600">
                    {healthData.relationships.journeyUserLinks}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Valid user connections
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Profile Links</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {healthData.relationships.profileUserLinks}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Valid user connections
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Orphaned Assessments</div>
                  <div className={`text-2xl font-bold ${healthData.dataQuality.orphanedAssessments > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {healthData.dataQuality.orphanedAssessments}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Missing user_id
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Orphaned Journeys</div>
                  <div className={`text-2xl font-bold ${healthData.dataQuality.orphanedJourneys > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {healthData.dataQuality.orphanedJourneys}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Missing user_id
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Empty Profiles</div>
                  <div className={`text-2xl font-bold ${healthData.dataQuality.emptyProfiles > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {healthData.dataQuality.emptyProfiles}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Missing job titles
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sample Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {healthData.sampleData.users.map((user) => (
                    <div key={user.id} className="text-sm">
                      <div className="font-medium">{user.email}</div>
                      <div className="text-muted-foreground">ID: {user.id} | Name: {user.name || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sample Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {healthData.sampleData.assessments.map((assessment) => (
                    <div key={assessment.id} className="text-sm">
                      <div className="font-medium">{assessment.email}</div>
                      <div className="text-muted-foreground">
                        Score: {assessment.ai_readiness_score} | Journey: {assessment.question_1_journey || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sample Journeys</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {healthData.sampleData.journeys.map((journey) => (
                    <div key={journey.id} className="text-sm">
                      <div className="font-medium">Journey ID: {journey.id}</div>
                      <div className="text-muted-foreground">
                        User: {journey.user_id || 'N/A'} | Stage: {journey.current_stage} | Complete: {journey.stage_1_completed ? 'Yes' : 'No'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timestamp */}
          <div className="text-center text-sm text-muted-foreground">
            Last updated: {new Date(healthData.timestamp).toLocaleString()}
          </div>
        </>
      )}
    </div>
  )
}

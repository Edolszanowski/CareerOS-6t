'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Users, Target } from 'lucide-react'

interface JobTitleComparison {
  jobTitle: string
  averageScore: number
  minScore: number
  maxScore: number
  sampleSize: number
  userPerformance: 'above' | 'below' | 'average'
  scoreDifference: number
}

interface ComparisonData {
  userMetrics: {
    score: number
    percentile: number
    performanceLevel: string
    industry: string
  }
  benchmarks: {
    totalUsers: number
    averageScore: number
    medianScore: number
    highestScore: number
    lowestScore: number
    standardDeviation: number
  }
  comparisons: {
    jobTitleComparison: JobTitleComparison[]
    scoreDistribution: Record<string, number>
    familiarityDistribution: Record<string, number>
    understandingDistribution: Record<string, number>
  }
  insights: {
    performanceLevel: string
    recommendation: string
    topJobTitles: string[]
    nextMilestone: string
  }
}

interface IndustryComparisonChartProps {
  userScore: number
  industry?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function IndustryComparisonChart({ userScore, industry = 'Technology' }: IndustryComparisonChartProps) {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/industry-comparison?industry=${encodeURIComponent(industry)}&score=${userScore}`)
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch comparison data')
        }
        
        if (result.success) {
          setComparisonData(result.data)
        } else {
          throw new Error(result.error || 'Invalid response format')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        console.error('Error fetching comparison data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userScore > 0) {
      fetchComparisonData()
    }
  }, [userScore, industry])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Industry Comparison</CardTitle>
          <CardDescription>Loading comparison data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-20 bg-gray-100 rounded animate-pulse" />
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
          <CardTitle>Industry Comparison</CardTitle>
          <CardDescription>Error loading comparison data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            <p className="font-medium">Unable to load comparison data</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!comparisonData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Industry Comparison</CardTitle>
          <CardDescription>No comparison data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Complete your assessment to see industry comparisons.</p>
        </CardContent>
      </Card>
    )
  }

  const { userMetrics, benchmarks, comparisons, insights } = comparisonData

  // Prepare chart data
  const jobTitleChartData = comparisons.jobTitleComparison.slice(0, 6).map(jt => ({
    name: jt.jobTitle.length > 15 ? jt.jobTitle.substring(0, 15) + '...' : jt.jobTitle,
    score: jt.averageScore,
    sampleSize: jt.sampleSize,
    isUser: false
  }))

  // Add user's score for comparison
  jobTitleChartData.push({
    name: 'Your Score',
    score: userMetrics.score,
    sampleSize: 1,
    isUser: true
  })

  const scoreDistributionData = Object.entries(comparisons.scoreDistribution).map(([range, count]) => ({
    name: range,
    value: count,
    percentage: Math.round((count / benchmarks.totalUsers) * 100)
  }))

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your AI Readiness Performance</CardTitle>
          <CardDescription>How you compare to {benchmarks.totalUsers} professionals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{userMetrics.score}</div>
              <div className="text-sm text-blue-700">Your Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{userMetrics.percentile}th</div>
              <div className="text-sm text-green-700">Percentile</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{benchmarks.averageScore}</div>
              <div className="text-sm text-purple-700">Industry Avg</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1">
                {userMetrics.score > benchmarks.averageScore ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <span className="text-lg font-bold">
                  {Math.abs(userMetrics.score - benchmarks.averageScore)}
                </span>
              </div>
              <div className="text-sm text-gray-700">vs Average</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={userMetrics.percentile >= 75 ? 'default' : 'secondary'}>
                {insights.performanceLevel}
              </Badge>
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{benchmarks.totalUsers} total assessments</span>
            </div>
            <p className="text-sm text-gray-700">{insights.recommendation}</p>
            <div className="mt-2 flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-700">Next milestone: {insights.nextMilestone}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Title Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Score by Job Title</CardTitle>
          <CardDescription>Average AI readiness scores across different roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobTitleChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} (${props.payload.sampleSize} ${props.payload.sampleSize === 1 ? 'assessment' : 'assessments'})`,
                    props.payload.isUser ? 'Your Score' : 'Average Score'
                  ]}
                />
                <Bar 
                  dataKey="score" 
                  fill={(entry) => entry.isUser ? '#FF8042' : '#0088FE'}
                  name="AI Readiness Score"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>How professionals are distributed across skill levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {scoreDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} professionals`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {scoreDistributionData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Statistics</CardTitle>
          <CardDescription>Comprehensive breakdown of assessment data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold">{benchmarks.highestScore}</div>
              <div className="text-sm text-gray-600">Highest Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{benchmarks.medianScore}</div>
              <div className="text-sm text-gray-600">Median Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{benchmarks.lowestScore}</div>
              <div className="text-sm text-gray-600">Lowest Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{benchmarks.standardDeviation}</div>
              <div className="text-sm text-gray-600">Std Deviation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

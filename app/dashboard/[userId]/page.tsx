import { Suspense } from 'react'
import { JourneyProgress } from '@/components/dashboard/journey-progress'
import { IndustryComparisonChart } from '@/components/dashboard/industry-comparison-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Brain, TrendingUp, Target } from 'lucide-react'

interface DashboardPageProps {
  params: {
    userId: string
  }
}

// Loading components
function JourneyProgressSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ComparisonChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const userId = parseInt(params.userId)

  if (isNaN(userId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Invalid User ID</CardTitle>
            <CardDescription>The provided user ID is not valid.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Please check the URL and ensure you have a valid user ID.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Readiness Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your AI journey and compare with industry professionals
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>User {userId}</span>
          </Badge>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">AI Assessment</p>
                <p className="text-lg font-bold">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-lg font-bold">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Journey</p>
                <p className="text-lg font-bold">Stage 2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Ranking</p>
                <p className="text-lg font-bold">Top 25%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Journey Progress - Takes up 1 column */}
        <div className="lg:col-span-1">
          <Suspense fallback={<JourneyProgressSkeleton />}>
            <JourneyProgress userId={userId} />
          </Suspense>
        </div>

        {/* Industry Comparison - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <Suspense fallback={<ComparisonChartSkeleton />}>
            <IndustryComparisonChart 
              userScore={85} 
              industry="Technology & Software" 
            />
          </Suspense>
        </div>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Information</CardTitle>
          <CardDescription>
            This dashboard provides a comprehensive view of your AI readiness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Journey Tracking</h4>
              <p className="text-sm text-gray-600">
                Monitor your progress through 5 key stages of AI adoption, from initial assessment 
                to full integration in your professional workflow.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Industry Benchmarking</h4>
              <p className="text-sm text-gray-600">
                Compare your AI readiness score with professionals in similar roles and industries 
                to understand where you stand and identify areas for improvement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

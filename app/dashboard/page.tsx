import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { JourneyProgress } from '@/components/dashboard/journey-progress'
import { IndustryComparisonChart } from '@/components/dashboard/industry-comparison-chart'
import { Brain, TrendingUp, Target, Users, BookOpen, Briefcase, Calendar, ArrowLeft, ExternalLink } from 'lucide-react'

export default function DashboardPage() {
  // This would come from your database/API in a real app
  const userData = {
    firstName: "Alex",
    aiReadinessScore: 78,
    industry: "Technology & Software",
    currentStage: 2,
    completedStages: [true, false, false, false, false]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {userData.firstName}!
                </h1>
                <p className="text-gray-600">Your AI Career Development Dashboard</p>
              </div>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              AI Readiness: {userData.aiReadinessScore}%
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Readiness Score</CardTitle>
              <Brain className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{userData.aiReadinessScore}%</div>
              <p className="text-xs text-gray-600">Above industry average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Career Stage</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Stage {userData.currentStage}</div>
              <p className="text-xs text-gray-600">Goal Setting Phase</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Industry Rank</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">Top 27%</div>
              <p className="text-xs text-gray-600">In {userData.industry}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">3/12</div>
              <p className="text-xs text-gray-600">Modules completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Journey Progress - Takes 2 columns */}
          <div className="lg:col-span-2">
            <JourneyProgress 
              currentStage={userData.currentStage}
              completedStages={userData.completedStages}
            />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Continue your AI career development</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Continue Learning Path
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Briefcase className="mr-2 h-4 w-4" />
                Explore Job Matches
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Join Community
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Coaching
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Industry Comparison - Full Width */}
        <div className="mb-8">
          <IndustryComparisonChart 
            userScore={userData.aiReadinessScore}
            userIndustry={userData.industry}
            industryAverage={65}
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest progress and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-green-800">AI Assessment Completed</p>
                  <p className="text-sm text-green-600">
                    Scored {userData.aiReadinessScore}% - Above industry average!
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  New Achievement
                </Badge>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-blue-800">Goal Setting Started</p>
                  <p className="text-sm text-blue-600">
                    Begin defining your AI career objectives
                  </p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Continue
                </Button>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Profile Created</p>
                  <p className="text-sm text-gray-600">
                    Welcome to CareerOS! Your journey begins now.
                  </p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useOnboarding } from "@/contexts/onboarding-context"
import { TrendingUp, Users, Target, Lightbulb, Star, ArrowRight, CheckCircle } from 'lucide-react'

interface PersonalizedInsightsProps {
  onNext: () => void
}

export function PersonalizedInsights({ onNext }: PersonalizedInsightsProps) {
  const { userData } = useOnboarding()
  const [aiReadinessScore, setAiReadinessScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Calculate AI Readiness Score based on responses
  useEffect(() => {
    const calculateScore = () => {
      let score = 0
      
      // Q1: AI Journey (0-25 points)
      const journeyScores = {
        'new': 5,
        'curious': 10,
        'behind': 15,
        'experimenting': 20,
        'daily-user': 25
      }
      score += journeyScores[userData.aiJourney as keyof typeof journeyScores] || 0
      
      // Q4: AI Understanding (0-25 points)
      const understandingScores = {
        'zero': 5,
        'lost': 10,
        'basics': 15,
        'strategic': 20,
        'expert': 25
      }
      score += understandingScores[userData.aiUnderstanding as keyof typeof understandingScores] || 0
      
      // Q5: Work Assistance Percentage (inverse scoring, 0-25 points)
      const percentage = userData.workAssistancePercentage || 50
      if (percentage <= 20) score += 25
      else if (percentage <= 40) score += 20
      else if (percentage <= 60) score += 15
      else if (percentage <= 80) score += 10
      else score += 5
      
      // Q7: Learning Style (0-25 points)
      const learningScores = {
        'practice-patience': 5,
        'guided': 10,
        'understand-why': 15,
        'structured': 20,
        'dive-in': 25
      }
      score += learningScores[userData.learningStyle as keyof typeof learningScores] || 0
      
      return Math.min(score, 100)
    }

    setTimeout(() => {
      setAiReadinessScore(calculateScore())
      setIsLoading(false)
    }, 1500)
  }, [userData])

  const getIndustryInsight = () => {
    const industryInsights = {
      'technology': 'Tech professionals with your profile typically see 40% productivity gains within 6 months',
      'healthcare': 'Healthcare professionals are finding AI reduces administrative work by 60%',
      'financial': 'Financial services leaders report AI helps them focus 70% more time on strategic decisions',
      'manufacturing': 'Manufacturing experts are using AI to optimize operations and reduce costs by 25%',
      'retail': 'Retail professionals are leveraging AI to personalize customer experiences and boost sales',
      'education': 'Educators are using AI to create personalized learning experiences for students',
      'marketing': 'Marketing professionals see 3x content creation speed with AI assistance',
      'legal': 'Legal professionals are reducing research time by 50% with AI-powered tools',
      'realestate': 'Real estate professionals are using AI to better match clients with properties',
      'government': 'Public sector leaders are streamlining citizen services with AI automation'
    }
    return industryInsights[userData.industry as keyof typeof industryInsights] || 'Professionals in your field are discovering new opportunities with AI every day'
  }

  const getRoleAdvantage = () => {
    const roleAdvantages = {
      'executive': 'Executive leaders who embrace AI early gain significant competitive advantages',
      'management': 'Managers with AI skills are 60% more effective at team coordination',
      'senior': 'Senior professionals combining experience with AI tools become invaluable mentors',
      'mid-level': 'Mid-level professionals who master AI often fast-track to leadership roles',
      'early-career': 'Early career professionals with AI skills are highly sought after',
      'freelance': 'Freelancers using AI can take on 40% more projects while maintaining quality',
      'business-owner': 'Business owners leveraging AI see average revenue increases of 30%',
      'student': 'Students learning AI skills graduate with immediate competitive advantages'
    }
    return roleAdvantages[userData.role as keyof typeof roleAdvantages] || 'Your role has unique opportunities for AI enhancement'
  }

  const getSuperpowerAmplification = () => {
    const superpowerAmplifications = {
      'creative-problem-solving': 'AI can handle research and data analysis, freeing you to focus on innovative solutions',
      'emotional-intelligence': 'AI can provide insights on team dynamics, amplifying your natural people skills',
      'strategic-thinking': 'AI can process vast amounts of data, giving you better inputs for strategic decisions',
      'leadership-inspiration': 'AI can handle routine communications, giving you more time for meaningful leadership',
      'domain-expertise': 'AI can stay current on industry trends, letting you focus on applying deep knowledge',
      'physical-skills': 'AI can optimize workflows and scheduling, maximizing your hands-on impact',
      'ethical-reasoning': 'AI can flag potential issues, supporting your ethical decision-making process',
      'cultural-understanding': 'AI can provide cultural context and translation, amplifying your empathy'
    }
    return superpowerAmplifications[userData.superpower as keyof typeof superpowerAmplifications] || 'Your unique human qualities become even more valuable when combined with AI'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-900">Analyzing Your Responses</h2>
          <p className="text-gray-600">Creating your personalized AI success plan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Your Personalized AI Success Plan</h1>
          <p className="text-lg text-gray-600">
            Thank you for trusting us with your journey. Here's what we learned about your unique path forward...
          </p>
        </div>

        {/* AI Readiness Score */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-900">Your AI Readiness Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold text-blue-600">{aiReadinessScore}</div>
            <Progress value={aiReadinessScore} className="w-full max-w-md mx-auto" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold">Industry Average</div>
                <div className="text-gray-600">52</div>
              </div>
              <div>
                <div className="font-semibold">Role Average</div>
                <div className="text-gray-600">58</div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Above Average - You're Ready to Accelerate
            </Badge>
          </CardContent>
        </Card>

        {/* Three Gifts */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-yellow-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <Lightbulb className="w-5 h-5" />
                Your Hidden Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{getIndustryInsight()}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Star className="w-5 h-5" />
                Your Natural Advantage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{getRoleAdvantage()}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Target className="w-5 h-5" />
                Your Next Brave Step
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{getSuperpowerAmplification()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Our Commitment */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Our Commitment to You</CardTitle>
            <p className="text-center text-blue-100">Based on your responses, we can help you:</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Save 122 hours of overwhelming research</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Increase your confidence (not just earnings)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Find your community of supporters</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Protect what you've built while growing further</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PROMINENT CALL TO ACTION - Made much more visible */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-center text-white shadow-2xl border-4 border-yellow-400">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">🎉 Ready to Begin Your Journey?</h2>
              <p className="text-xl font-medium">
                Join 10,000+ professionals who chose growth over fear
              </p>
              <p className="text-lg opacity-90">
                We're here every step of the way. Your personalized dashboard is waiting!
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-lg">
              <Users className="w-6 h-6" />
              <span>2,341 professionals share your 2-year vision</span>
            </div>

            {/* SUPER PROMINENT BUTTON */}
            <div className="pt-4">
              <Button 
                onClick={onNext}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-2xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-yellow-400"
              >
                Continue to Dashboard
                <ArrowRight className="w-8 h-8 ml-3" />
              </Button>
            </div>

            <div className="text-sm opacity-75">
              ⚡ Your AI success plan is ready to activate
            </div>
          </div>
        </div>

        {/* Secondary info card - less prominent */}
        <Card className="text-center bg-white/50">
          <CardContent className="pt-6">
            <p className="text-gray-600">
              Your journey to AI mastery starts with one click above ↑
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

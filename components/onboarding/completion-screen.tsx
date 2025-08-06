"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useOnboarding } from "@/contexts/onboarding-context"
import { completeOnboarding } from "@/actions/user-actions"
import { CheckCircle } from "lucide-react"

export function CompletionScreen() {
  const { userId } = useOnboarding()

  const handleComplete = async () => {
    if (userId) {
      await completeOnboarding(userId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Career OS!</h1>
            <p className="text-gray-600">
              Your profile has been created successfully. You're all set to start your career journey with us.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Profile created</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Career preferences saved</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Ready to explore opportunities</span>
            </div>
          </div>

          <Button onClick={handleComplete} className="w-full bg-indigo-600 hover:bg-indigo-700">
            Enter Career OS
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useOnboarding } from "@/contexts/onboarding-context"
import { createUser } from "@/actions/user-actions"
import { ArrowLeft, Shield, Mail } from "lucide-react"
import { ProgressIndicator } from "./progress-indicator"

export function ContactInfoForm() {
  const { nextStep, prevStep, setUserId, userData } = useOnboarding()
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await createUser(formData)

    if (result.success && result.userId) {
      setUserId(result.userId)
      nextStep()
    } else {
      setError(result.error || "Failed to create account")
    }

    setIsLoading(false)
  }

  return (
    <>
      <ProgressIndicator />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-24">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <CardTitle>Save Your Personalized Strategy</CardTitle>
                <p className="text-sm text-gray-600">Just need a few details to create your account</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Your information is secure and never shared</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>We'll send you your personalized career strategy</span>
                </div>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                {isLoading ? "Creating Your Account..." : "Create My Career OS Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

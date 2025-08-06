"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useOnboarding } from "@/contexts/onboarding-context"
import { updateUserProfile, updateOnboardingProgress } from "@/actions/user-actions"
import { ArrowLeft } from "lucide-react"

export function CareerProfileForm() {
  const { userId, nextStep, prevStep } = useOnboarding()
  const [formData, setFormData] = useState({
    currentRole: "",
    experienceLevel: "",
    industry: "",
    careerGoals: "",
    educationLevel: "",
    location: "",
    remotePreference: "",
    salaryExpectation: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setIsLoading(true)

    const profileData = {
      ...formData,
      salaryExpectation: formData.salaryExpectation ? Number.parseInt(formData.salaryExpectation) : undefined,
    }

    await updateUserProfile(userId, profileData)
    await updateOnboardingProgress(userId, 2)

    setIsLoading(false)
    nextStep()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={prevStep}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <CardTitle>Career Profile</CardTitle>
              <p className="text-sm text-gray-600">Step 2 of 5</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="currentRole">Current Role</Label>
              <Input
                id="currentRole"
                value={formData.currentRole}
                onChange={(e) => setFormData((prev) => ({ ...prev, currentRole: e.target.value }))}
                placeholder="e.g., Software Engineer, Marketing Manager"
              />
            </div>

            <div>
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, experienceLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                  <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                  <SelectItem value="executive">Executive (10+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="educationLevel">Education Level</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, educationLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="associates">Associate's Degree</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="City, State/Country"
              />
            </div>

            <div>
              <Label htmlFor="remotePreference">Remote Work Preference</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, remotePreference: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Fully Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="careerGoals">Career Goals</Label>
              <Textarea
                id="careerGoals"
                value={formData.careerGoals}
                onChange={(e) => setFormData((prev) => ({ ...prev, careerGoals: e.target.value }))}
                placeholder="What are your career aspirations?"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnboarding } from "@/contexts/onboarding-context"
import { createEmployerLead } from "@/actions/employer-actions"
import { ArrowLeft, Building, Mail, Users } from "lucide-react"

export function EmployerContactForm() {
  const { prevStep, userData, nextStep } = useOnboarding()
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    jobTitle: "",
    teamSize: "",
    industry: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const leadData = {
      ...formData,
      employerTools: userData.employerTools || [],
      userType: "employer",
    }

    const result = await createEmployerLead(leadData)

    if (result.success) {
      nextStep()
    } else {
      setError(result.error || "Failed to submit information")
    }

    setIsLoading(false)
  }

  // Determine next steps based on selected tools
  const hasNewsletterInterest = userData.employerTools?.includes("industry-updates")
  const hasTrainingInterest = userData.employerTools?.some((tool: string) =>
    ["career-guidance", "hr-leadership"].includes(tool),
  )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={prevStep} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="text-sm font-medium text-gray-900">Career OS for Teams</div>
            <div className="text-xs text-gray-500">Contact Information</div>
          </div>
        </div>
        <div className="text-lg font-bold">Career OS</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Let's get you set up</CardTitle>
              <p className="text-sm text-gray-600">
                We'll send you relevant resources and updates based on your selections
              </p>
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
                  <Label htmlFor="email">Work Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))}
                    placeholder="e.g., HR Manager, Team Lead"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, teamSize: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
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
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* What to expect */}
                <div className="space-y-3 pt-4">
                  <h3 className="font-medium text-gray-900">What happens next:</h3>
                  <div className="space-y-2">
                    {hasNewsletterInterest && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>Industry updates delivered to your inbox</span>
                      </div>
                    )}
                    {hasTrainingInterest && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-green-600" />
                        <span>Access to targeted training resources</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building className="w-4 h-4 text-purple-600" />
                      <span>Early access to Career OS for Teams</span>
                    </div>
                  </div>
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={isLoading}>
                  {isLoading ? "Setting up your account..." : "Get Started"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

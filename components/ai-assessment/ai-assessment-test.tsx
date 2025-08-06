"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveAIAssessment, getAIAssessment } from "@/actions/ai-assessment-actions"
import { CheckCircle, AlertCircle, TestTube, Database } from 'lucide-react'

export function AIAssessmentTest() {
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [retrievedData, setRetrievedData] = useState<any>(null)

  const runAssessmentTest = async () => {
    setIsLoading(true)
    setResult(null)
    setRetrievedData(null)

    try {
      // Test data with correct structure
      const testAssessment = {
        email: testEmail,
        aiJourney: "experimenting",
        industry: "technology",
        role: { role: "mid-level", function: "Product & Innovation" },
        understanding: "practical",
        workAssistance: 65,
        superpower: "creative",
        learningStyle: "structured",
        vision: "specialist",
      }

      console.log("Testing AI assessment save with:", testAssessment)

      // Save assessment
      const saveResult = await saveAIAssessment(testAssessment)
      setResult(saveResult)

      if (saveResult.success) {
        // Retrieve the saved assessment
        const retrieved = await getAIAssessment(testEmail)
        setRetrievedData(retrieved)
      }
    } catch (error) {
      console.error("Test error:", error)
      setResult({
        success: false,
        error: `Test failed: ${error}`,
      })
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          AI Assessment Database Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="testEmail">Test Email</Label>
            <Input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={runAssessmentTest} disabled={isLoading || !testEmail}>
              {isLoading ? "Testing..." : "Run Test"}
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            {/* Save Result */}
            <div
              className={`p-4 rounded-lg border ${
                result.success
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {result.success ? "✅ Assessment Saved Successfully!" : "❌ Save Failed"}
                </span>
              </div>
              <p className="text-sm">{result.message || result.error}</p>
              
              {result.success && result.scores && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <h4 className="font-medium text-gray-900 mb-2">Calculated Scores:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>AI Preparedness: {result.scores.aiPreparedness}/100</div>
                    <div>Usage: {result.scores.usage}/100</div>
                    <div>Understanding: {result.scores.understanding}/100</div>
                    <div>Future Readiness: {result.scores.futureReadiness}/100</div>
                    <div className="col-span-2 font-medium">Overall: {result.scores.overall}/100</div>
                  </div>
                </div>
              )}
            </div>

            {/* Retrieved Data */}
            {retrievedData && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Retrieved Assessment Data:</span>
                </div>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>Email: {retrievedData.email}</div>
                  <div>AI Journey: {retrievedData.ai_journey}</div>
                  <div>Industry: {retrievedData.industry}</div>
                  <div>Role: {retrievedData.role_category} - {retrievedData.role_function}</div>
                  <div>Understanding: {retrievedData.understanding_level}</div>
                  <div>Work Assistance: {retrievedData.work_assistance_percentage}%</div>
                  <div>Superpower: {retrievedData.superpower}</div>
                  <div>Learning Style: {retrievedData.learning_style}</div>
                  <div>Vision: {retrievedData.vision}</div>
                  <div>Overall Score: {retrievedData.overall_score}/100</div>
                  <div>Completed: {new Date(retrievedData.completed_at).toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          This test will save a sample AI assessment and retrieve it to verify the database integration is working correctly.
        </div>
      </CardContent>
    </Card>
  )
}

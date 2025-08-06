"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Database, Table, Settings, RotateCcw, FileText } from 'lucide-react'
import { setupDatabase, resetDatabase } from "@/actions/setup-actions"

interface TestResult {
  success: boolean
  message?: string
  connection?: any
  tables?: string[]
  tablesExist?: boolean
  error?: string
  databaseUrl?: string
  schema?: any[]
}

export function DatabaseTest() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [showSchema, setShowSchema] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: `Connection failed: ${error}`,
      })
    }

    setIsLoading(false)
  }

  const inspectSchema = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/inspect-schema")
      const data = await response.json()
      setResult(prev => ({ ...prev, ...data }))
      setShowSchema(true)
    } catch (error) {
      setResult(prev => ({
        ...prev,
        success: false,
        error: `Schema inspection failed: ${error}`,
      }))
    }

    setIsLoading(false)
  }

  const downloadSchema = () => {
    if (result?.schema) {
      const schemaText = JSON.stringify(result.schema, null, 2)
      const blob = new Blob([schemaText], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'database-schema.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleSetupDatabase = async () => {
    setIsSettingUp(true)

    try {
      const setupResult = await setupDatabase()

      if (setupResult.success) {
        await testConnection()
      } else {
        setResult({
          success: false,
          error: setupResult.error || "Failed to setup database",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        error: `Setup failed: ${error}`,
      })
    }

    setIsSettingUp(false)
  }

  const handleResetDatabase = async () => {
    if (!confirm("Are you sure you want to reset the database? This will delete all data.")) {
      return
    }

    setIsResetting(true)

    try {
      const resetResult = await resetDatabase()

      if (resetResult.success) {
        await testConnection()
      } else {
        setResult({
          success: false,
          error: resetResult.error || "Failed to reset database",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        error: `Reset failed: ${error}`,
      })
    }

    setIsResetting(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Management & Schema Inspector
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={testConnection} disabled={isLoading} className="flex-1">
            {isLoading ? "Testing..." : "Test Connection"}
          </Button>
          <Button onClick={inspectSchema} disabled={isLoading} variant="outline" className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            {isLoading ? "Inspecting..." : "Inspect Schema"}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSetupDatabase}
            disabled={isSettingUp}
            variant="outline"
            className="flex-1 flex items-center gap-2 bg-transparent"
          >
            <Settings className="w-4 h-4" />
            {isSettingUp ? "Setting up..." : "Setup DB"}
          </Button>
          <Button
            onClick={handleResetDatabase}
            disabled={isResetting}
            variant="outline"
            className="flex-1 flex items-center gap-2 bg-transparent"
          >
            <RotateCcw className="w-4 h-4" />
            {isResetting ? "Resetting..." : "Reset DB"}
          </Button>
        </div>

        {result?.schema && (
          <Button onClick={downloadSchema} variant="outline" className="w-full">
            Download Schema as JSON
          </Button>
        )}

        {result && (
          <div className="space-y-3">
            {/* Connection Status */}
            <div
              className={`p-3 rounded-md text-sm flex items-center gap-2 ${
                result.success
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {result.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {result.success ? "✅ Database connected successfully!" : `❌ ${result.error}`}
            </div>

            {/* Database URL Status */}
            {result.databaseUrl && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                <div className="flex items-center gap-2 text-blue-900">
                  <Database className="w-4 h-4" />
                  <span className="font-medium">Database URL: {result.databaseUrl}</span>
                </div>
              </div>
            )}

            {/* Connection Details */}
            {result.success && result.connection && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                <div className="font-medium text-blue-900 mb-1">Connection Details:</div>
                <div className="text-blue-800">
                  Connected at: {new Date(result.connection.timestamp).toLocaleString()}
                </div>
              </div>
            )}

            {/* Tables Status */}
            {result.success && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm">
                <div className="flex items-center gap-2 font-medium text-gray-900 mb-2">
                  <Table className="w-4 h-4" />
                  Database Tables:
                </div>
                <div className="space-y-1">
                  {["users", "user_profile", "onboarding_progress", "employer_leads", "ai_assessments"].map((tableName) => (
                    <div key={tableName} className="flex items-center gap-2">
                      {result.tables?.includes(tableName) ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-red-600" />
                      )}
                      <span className={result.tables?.includes(tableName) ? "text-green-800" : "text-red-800"}>
                        {tableName}
                      </span>
                    </div>
                  ))}
                </div>

                {!result.tablesExist && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                    <strong>Note:</strong> Some tables are missing. Click "Setup DB" to create them.
                  </div>
                )}
              </div>
            )}

            {/* Schema Details */}
            {showSchema && result.schema && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-md text-sm">
                <div className="flex items-center gap-2 font-medium text-purple-900 mb-3">
                  <FileText className="w-4 h-4" />
                  Database Schema Details:
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {result.schema.map((table: any, index: number) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Table: {table.table_name}
                      </h4>
                      <div className="space-y-1 text-xs">
                        {table.columns?.map((col: any, colIndex: number) => (
                          <div key={colIndex} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                            <span className="font-mono text-blue-600">{col.column_name}</span>
                            <div className="flex gap-2 text-gray-600">
                              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {col.data_type}
                                {col.character_maximum_length && `(${col.character_maximum_length})`}
                              </span>
                              {col.is_nullable === 'NO' && (
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">NOT NULL</span>
                              )}
                              {col.column_default && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">DEFAULT</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {result?.success && result?.tablesExist && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
            🎉 <strong>Ready to go!</strong> Your database is properly configured and all tables exist.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

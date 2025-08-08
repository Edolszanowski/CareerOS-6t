"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, Database, Loader2 } from 'lucide-react'

interface ColumnInfo {
  name: string
  type: string
  max_length: number | null
  nullable: string
}

interface VerificationResult {
  success: boolean
  table_exists: boolean
  job_title_column_exists: boolean
  job_title_details: {
    column_name: string
    data_type: string
    max_length: number
    is_nullable: string
    column_default: string | null
  } | null
  index_exists: boolean
  all_columns: ColumnInfo[]
  verification_status: 'PERFECT' | 'EXISTS_BUT_WRONG_TYPE' | 'MISSING'
  error?: string
}

export function DatabaseSchemaChecker() {
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const verifySchema = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/verify-job-title-column')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        table_exists: false,
        job_title_column_exists: false,
        job_title_details: null,
        index_exists: false,
        all_columns: [],
        verification_status: 'MISSING',
        error: 'Failed to connect to verification API'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PERFECT':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'EXISTS_BUT_WRONG_TYPE':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'MISSING':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PERFECT':
        return <Badge variant="default" className="bg-green-500">Perfect ✓</Badge>
      case 'EXISTS_BUT_WRONG_TYPE':
        return <Badge variant="secondary" className="bg-yellow-500">Wrong Type</Badge>
      case 'MISSING':
        return <Badge variant="destructive">Missing</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Schema Verification
          </CardTitle>
          <CardDescription>
            Verify that the user_profiles table has the job_title column with VARCHAR(200)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={verifySchema} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying Schema...
              </>
            ) : (
              'Verify job_title Column'
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Verification Results</span>
                {getStatusBadge(result.verification_status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Table Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">user_profiles table exists</span>
                {result.table_exists ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>

              {/* Column Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">job_title column exists</span>
                {result.job_title_column_exists ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>

              {/* Index Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Performance index exists</span>
                {result.index_exists ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>

              {/* Error Display */}
              {result.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">Error:</p>
                  <p className="text-red-600">{result.error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Column Details */}
          {result.job_title_details && (
            <Card>
              <CardHeader>
                <CardTitle>job_title Column Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-700">Data Type:</p>
                    <p className="text-gray-900">{result.job_title_details.data_type}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Max Length:</p>
                    <p className="text-gray-900">{result.job_title_details.max_length}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Nullable:</p>
                    <p className="text-gray-900">{result.job_title_details.is_nullable}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Default:</p>
                    <p className="text-gray-900">{result.job_title_details.column_default || 'NULL'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Columns */}
          {result.all_columns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>All Columns in user_profiles Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.all_columns.map((column, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-2 rounded ${
                        column.name === 'job_title' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <span className={`font-medium ${column.name === 'job_title' ? 'text-blue-700' : 'text-gray-700'}`}>
                        {column.name}
                        {column.name === 'job_title' && <Badge variant="outline" className="ml-2">Target Column</Badge>}
                      </span>
                      <span className="text-gray-600">
                        {column.type}
                        {column.max_length && `(${column.max_length})`}
                        {column.nullable === 'YES' && ' NULL'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {result.verification_status === 'PERFECT' ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">✅ Schema is perfect!</p>
                  <p className="text-green-600">The job_title column is properly configured for newsletter personalization.</p>
                </div>
              ) : result.verification_status === 'MISSING' ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">❌ Column is missing</p>
                  <p className="text-red-600">Run the migration script: <code>scripts/004-add-job-title-column.sql</code></p>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700 font-medium">⚠️ Column exists but wrong type</p>
                  <p className="text-yellow-600">Expected: VARCHAR(200), Found: {result.job_title_details?.data_type}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

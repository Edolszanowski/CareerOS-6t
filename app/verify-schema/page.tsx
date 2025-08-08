import { DatabaseSchemaChecker } from '@/components/database-schema-checker'

export default function VerifySchemaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Database Schema Verification</h1>
          <p className="mt-2 text-gray-600">
            Verify that your database schema is properly configured for CareerOS
          </p>
        </div>
        
        <DatabaseSchemaChecker />
      </div>
    </div>
  )
}

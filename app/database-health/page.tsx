import { DatabaseHealthChecker } from '@/components/database-health-checker'

export default function DatabaseHealthPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <DatabaseHealthChecker />
    </div>
  )
}

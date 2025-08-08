import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Check table existence and record counts
    const tableChecks = await Promise.all([
      sql`SELECT COUNT(*) as count FROM users`,
      sql`SELECT COUNT(*) as count FROM user_profiles`,
      sql`SELECT COUNT(*) as count FROM ai_assessments`,
      sql`SELECT COUNT(*) as count FROM user_journey_stages`
    ])

    // Check foreign key relationships
    const relationshipChecks = await Promise.all([
      sql`
        SELECT COUNT(*) as valid_links
        FROM ai_assessments a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.user_id IS NOT NULL AND u.id IS NOT NULL
      `,
      sql`
        SELECT COUNT(*) as valid_links
        FROM user_journey_stages ujs
        LEFT JOIN users u ON ujs.user_id = u.id
        WHERE ujs.user_id IS NOT NULL AND u.id IS NOT NULL
      `,
      sql`
        SELECT COUNT(*) as valid_links
        FROM user_profiles up
        LEFT JOIN users u ON up.user_id = u.id
        WHERE up.user_id IS NOT NULL AND u.id IS NOT NULL
      `
    ])

    // Get sample data for verification
    const sampleData = await Promise.all([
      sql`SELECT id, email, name FROM users LIMIT 3`,
      sql`SELECT id, email, ai_readiness_score, question_1_journey FROM ai_assessments LIMIT 3`,
      sql`SELECT id, user_id, current_stage, stage_1_completed FROM user_journey_stages LIMIT 3`
    ])

    // Check data quality issues
    const dataQualityChecks = await Promise.all([
      sql`SELECT COUNT(*) as orphaned_assessments FROM ai_assessments WHERE user_id IS NULL`,
      sql`SELECT COUNT(*) as orphaned_journeys FROM user_journey_stages WHERE user_id IS NULL`,
      sql`SELECT COUNT(*) as empty_profiles FROM user_profiles WHERE job_title IS NULL OR job_title = ''`
    ])

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalUsers: parseInt(tableChecks[0][0].count),
        totalProfiles: parseInt(tableChecks[1][0].count),
        totalAssessments: parseInt(tableChecks[2][0].count),
        totalJourneyRecords: parseInt(tableChecks[3][0].count)
      },
      relationships: {
        assessmentUserLinks: parseInt(relationshipChecks[0][0].valid_links),
        journeyUserLinks: parseInt(relationshipChecks[1][0].valid_links),
        profileUserLinks: parseInt(relationshipChecks[2][0].valid_links)
      },
      dataQuality: {
        orphanedAssessments: parseInt(dataQualityChecks[0][0].orphaned_assessments),
        orphanedJourneys: parseInt(dataQualityChecks[1][0].orphaned_journeys),
        emptyProfiles: parseInt(dataQualityChecks[2][0].empty_profiles)
      },
      sampleData: {
        users: sampleData[0],
        assessments: sampleData[1],
        journeys: sampleData[2]
      },
      issues: []
    }

    // Identify issues
    if (response.dataQuality.orphanedAssessments > 0) {
      response.issues.push(`${response.dataQuality.orphanedAssessments} assessments have no user_id`)
    }
    if (response.dataQuality.orphanedJourneys > 0) {
      response.issues.push(`${response.dataQuality.orphanedJourneys} journey records have no user_id`)
    }
    if (response.summary.totalProfiles === 0) {
      response.issues.push('No user profiles exist - users need profile data')
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Database health check failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Database health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

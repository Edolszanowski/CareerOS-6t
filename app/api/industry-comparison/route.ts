import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get("industry") || "Technology"
    const userScore = Number.parseInt(searchParams.get("score") || "0")

    if (isNaN(userScore) || userScore < 0 || userScore > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid score parameter. Must be between 0 and 100.",
        },
        { status: 400 },
      )
    }

    // Get comprehensive industry statistics
    const industryStats = await sql`
      SELECT 
        up.job_title,
        a.ai_readiness_score,
        a.question_1_journey,
        a.question_4_knowledge,
        a.question_2_industry,
        a.completed_at,
        u.email
      FROM ai_assessments a
      JOIN users u ON a.user_id = u.id
      JOIN user_profiles up ON u.id = up.user_id
      WHERE a.ai_readiness_score IS NOT NULL
      AND a.ai_readiness_score > 0
      AND up.job_title IS NOT NULL
      ORDER BY a.ai_readiness_score DESC
    `

    if (industryStats.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No assessment data available for comparison",
        },
        { status: 404 },
      )
    }

    // Calculate overall statistics
    const allScores = industryStats.map((stat) => stat.ai_readiness_score)
    const totalUsers = allScores.length
    const averageScore = Math.round(allScores.reduce((a, b) => a + b, 0) / totalUsers)
    const sortedScores = [...allScores].sort((a, b) => a - b)
    const medianScore = sortedScores[Math.floor(sortedScores.length / 2)]
    const highestScore = Math.max(...allScores)
    const lowestScore = Math.min(...allScores)

    // Calculate user percentile
    const scoresBelow = allScores.filter((score) => score < userScore).length
    const percentile = Math.round((scoresBelow / totalUsers) * 100)

    // Group by job title for detailed comparison
    const jobTitleStats = industryStats.reduce(
      (acc, stat) => {
        const title = stat.job_title
        if (!acc[title]) {
          acc[title] = {
            scores: [],
            journeyLevels: [],
            knowledgeLevels: [],
            count: 0,
          }
        }
        acc[title].scores.push(stat.ai_readiness_score)
        acc[title].journeyLevels.push(stat.question_1_journey)
        acc[title].knowledgeLevels.push(stat.question_4_knowledge)
        acc[title].count++
        return acc
      },
      {} as Record<string, any>,
    )

    // Calculate job title averages and comparisons
    const jobTitleComparison = Object.entries(jobTitleStats)
      .map(([title, stats]) => {
        const avgScore = Math.round(stats.scores.reduce((a: number, b: number) => a + b, 0) / stats.count)
        const minScore = Math.min(...stats.scores)
        const maxScore = Math.max(...stats.scores)

        return {
          jobTitle: title,
          averageScore: avgScore,
          minScore,
          maxScore,
          sampleSize: stats.count,
          userPerformance: userScore > avgScore ? "above" : userScore < avgScore ? "below" : "average",
          scoreDifference: userScore - avgScore,
        }
      })
      .sort((a, b) => b.averageScore - a.averageScore)

    // Calculate journey distribution
    const journeyDistribution = industryStats.reduce(
      (acc, stat) => {
        const journey = stat.question_1_journey || "unknown"
        acc[journey] = (acc[journey] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Calculate knowledge level distribution
    const knowledgeDistribution = industryStats.reduce(
      (acc, stat) => {
        const knowledge = stat.question_4_knowledge || "unknown"
        acc[knowledge] = (acc[knowledge] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Score distribution by ranges
    const scoreDistribution = {
      "Expert (90-100)": allScores.filter((s) => s >= 90).length,
      "Advanced (80-89)": allScores.filter((s) => s >= 80 && s < 90).length,
      "Intermediate (70-79)": allScores.filter((s) => s >= 70 && s < 80).length,
      "Beginner (60-69)": allScores.filter((s) => s >= 60 && s < 70).length,
      "Novice (0-59)": allScores.filter((s) => s < 60).length,
    }

    // Performance insights
    const insights = {
      performanceLevel:
        percentile >= 90
          ? "Exceptional"
          : percentile >= 75
            ? "Above Average"
            : percentile >= 50
              ? "Average"
              : percentile >= 25
                ? "Below Average"
                : "Needs Improvement",

      recommendation:
        userScore > averageScore
          ? `Excellent! You scored ${userScore - averageScore} points above the average.`
          : `You scored ${averageScore - userScore} points below average. Focus on AI fundamentals to improve.`,

      topJobTitles: jobTitleComparison.slice(0, 3).map((jt) => jt.jobTitle),

      nextMilestone:
        userScore < 60
          ? "Reach Beginner level (60+)"
          : userScore < 70
            ? "Reach Intermediate level (70+)"
            : userScore < 80
              ? "Reach Advanced level (80+)"
              : userScore < 90
                ? "Reach Expert level (90+)"
                : "Maintain Expert status",
    }

    const response = {
      success: true,
      data: {
        userMetrics: {
          score: userScore,
          percentile,
          performanceLevel: insights.performanceLevel,
          industry,
        },
        benchmarks: {
          totalUsers,
          averageScore,
          medianScore,
          highestScore,
          lowestScore,
          standardDeviation: Math.round(
            Math.sqrt(allScores.reduce((acc, score) => acc + Math.pow(score - averageScore, 2), 0) / totalUsers),
          ),
        },
        comparisons: {
          jobTitleComparison,
          scoreDistribution,
          journeyDistribution,
          knowledgeDistribution,
        },
        insights,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching industry comparison:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch industry comparison data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

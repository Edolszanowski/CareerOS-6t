"use server"

export interface EmployerLeadData {
  email: string
  firstName: string
  lastName: string
  company: string
  jobTitle: string
  teamSize: string
  industry: string
  employerTools: string[]
  userType: string
}

async function getDbConnection() {
  try {
    const { sql } = await import("@/lib/db")
    return sql
  } catch (error) {
    console.error("Database connection error:", error)
    throw new Error("Database connection failed")
  }
}

export async function createEmployerLead(leadData: EmployerLeadData) {
  try {
    console.log("Creating employer lead with data:", leadData)

    const sql = await getDbConnection()

    // Check if lead already exists
    const existingLead = await sql`
      SELECT id FROM employer_leads WHERE email = ${leadData.email}
    `

    if (existingLead.length > 0) {
      // Update existing lead
      await sql`
        UPDATE employer_leads SET
          first_name = ${leadData.firstName},
          last_name = ${leadData.lastName},
          company = ${leadData.company},
          job_title = ${leadData.jobTitle},
          team_size = ${leadData.teamSize},
          industry = ${leadData.industry},
          employer_tools = ${leadData.employerTools},
          updated_at = CURRENT_TIMESTAMP
        WHERE email = ${leadData.email}
      `
      return { success: true, message: "Lead updated successfully" }
    } else {
      // Create new lead
      await sql`
        INSERT INTO employer_leads (
          email, first_name, last_name, company, job_title, 
          team_size, industry, employer_tools, user_type
        )
        VALUES (
          ${leadData.email}, ${leadData.firstName}, ${leadData.lastName},
          ${leadData.company}, ${leadData.jobTitle}, ${leadData.teamSize},
          ${leadData.industry}, ${leadData.employerTools}, ${leadData.userType}
        )
      `
      return { success: true, message: "Lead created successfully" }
    }
  } catch (error) {
    console.error("Error creating employer lead:", error)

    if (error instanceof Error && error.message.includes("relation") && error.message.includes("does not exist")) {
      return { success: false, error: "Database tables not found. Please run the setup script first." }
    }

    return { success: false, error: "Failed to save information. Please try again." }
  }
}

export async function getEmployerLeads() {
  try {
    const sql = await getDbConnection()

    const leads = await sql`
      SELECT * FROM employer_leads 
      ORDER BY created_at DESC
    `

    return { success: true, leads }
  } catch (error) {
    console.error("Error fetching employer leads:", error)
    return { success: false, error: "Failed to fetch leads" }
  }
}

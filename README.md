# CareerOS AI Assessment Dashboard

A comprehensive AI readiness assessment platform with real-time analytics, user journey tracking, and industry benchmarking.

## Project Structure

- /docs - Documentation and specifications
- /src/components - React components (V0.dev)
- /src/lib - Backend logic
- /n8n - Workflow automation
- /changelogs - Development history

## Current Status

See docs/IMPLEMENTATION_TRACKER.md

## 🚀 Features

- **AI Readiness Assessment**: 8-question comprehensive evaluation
- **User Journey Tracking**: 5-stage progression monitoring
- **Industry Benchmarking**: Compare scores with professionals
- **Real-time Analytics**: Live dashboard with health monitoring
- **Database Health Monitoring**: Comprehensive system diagnostics

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Neon PostgreSQL
- **UI**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **TypeScript**: Full type safety

## 📊 Database Schema

### Core Tables
- `users` - User accounts and basic info
- `user_profiles` - Professional details and job titles
- `ai_assessments` - Assessment responses and scores
- `user_journey_stages` - Progress tracking through 5 stages

## 🔧 Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Edolszanowski/CareerOS-6t.git
   cd CareerOS-6t
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   # Add your DATABASE_URL
   \`\`\`

4. **Run database setup scripts**
   \`\`\`bash
   # Execute the SQL scripts in order:
   # scripts/017-fix-data-relationships.sql
   \`\`\`

5. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📱 Key Pages

- `/` - Main assessment interface
- `/dashboard/[userId]` - Individual user dashboard
- `/database-health` - System health monitoring
- `/assessment` - Assessment flow

## 🔗 API Endpoints

- `GET /api/user-journey/[userId]` - User progress data
- `GET /api/industry-comparison` - Benchmarking statistics
- `GET /api/database-health` - System health check

## 🧪 Testing

Visit `/database-health` to run comprehensive system tests and verify all components are working correctly.

## 📈 Deployment

Deploy to Vercel with one click or use the GitHub integration for continuous deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

export type RoadmapStatus = 'planned' | 'in-progress' | 'completed' | 'on-hold'
export type RoadmapPriority = 'high' | 'medium' | 'low'
export type RoadmapComplexity = 'high' | 'medium' | 'low'

export interface RoadmapItem {
  id: string
  title: string
  description: string
  priority: RoadmapPriority
  complexity: RoadmapComplexity
  status: RoadmapStatus
  phase: string
}

export const ROADMAP_ITEMS: RoadmapItem[] = [
  // Phase 1: Financial Clarity Foundation
  {
    id: 'financial-dashboard',
    title: 'Financial BattleStation',
    description:
      'Core financial BattleStation providing clarity on where you are financially - balances, transactions, and net worth tracking.',
    priority: 'high',
    complexity: 'medium',
    status: 'completed',
    phase: 'Phase 1: Financial Clarity Foundation',
  },
  {
    id: 'budget-tracking',
    title: 'Budget Tracking & Planning',
    description:
      'Proactive budget planning and tracking tools to help you plan ahead instead of reacting to financial surprises.',
    priority: 'high',
    complexity: 'medium',
    status: 'completed',
    phase: 'Phase 1: Financial Clarity Foundation',
  },
  {
    id: 'transaction-import',
    title: 'Automated Transaction Import',
    description:
      "CSV import functionality to automate financial tracking so you don't have to remember every transaction manually.",
    priority: 'high',
    complexity: 'low',
    status: 'completed',
    phase: 'Phase 1: Financial Clarity Foundation',
  },
  {
    id: 'financial-reports',
    title: 'Financial Reports & Analytics',
    description:
      "Comprehensive reports showing what's actually happening with your finances, not what you think is happening.",
    priority: 'high',
    complexity: 'medium',
    status: 'completed',
    phase: 'Phase 1: Financial Clarity Foundation',
  },
  {
    id: 'bank-integration',
    title: 'Bank Account Integration',
    description:
      'Direct bank account connections for automatic transaction syncing, eliminating manual CSV imports.',
    priority: 'high',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 1: Financial Clarity Foundation',
  },
  {
    id: 'user-auth',
    title: 'User Authentication & Data Security',
    description:
      'Secure user accounts with encrypted financial data storage, ensuring your information stays private and protected.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 1: Financial Clarity Foundation',
  },
  {
    id: 'grok-4-fast-api',
    title: 'Grok 4 Fast API Integration',
    description:
      "Integrated Grok 4 Fast API (both reasoning and speed variants) into AI chat with model selection UI. Provides users with access to xAI's latest large model optimized for agentic tool-calling, long-context workflows, and low-latency inference.",
    priority: 'high',
    complexity: 'medium',
    status: 'completed',
    phase: 'Phase 1: Financial Clarity Foundation',
  },

  // Phase 2: Decision Frameworks & Planning
  {
    id: 'goal-setting',
    title: 'Goal Setting & Future Design',
    description:
      'Tools to help you design your future by setting clear financial goals and building actionable plans to achieve them.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 2: Decision Frameworks & Planning',
  },
  {
    id: 'decision-frameworks',
    title: 'Decision Framework Tools',
    description:
      'Built-in frameworks for making financial decisions with clear criteria, reducing decision fatigue and analysis paralysis.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 2: Decision Frameworks & Planning',
  },
  {
    id: 'scenario-planning',
    title: 'Financial Scenario Planning',
    description:
      'Model different financial scenarios (job change, major purchase, emergency) to make proactive decisions instead of reactive ones.',
    priority: 'medium',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 2: Decision Frameworks & Planning',
  },
  {
    id: 'bill-forecasting',
    title: 'Bill Forecasting & Alerts',
    description:
      'Predictive bill tracking that shows upcoming expenses and alerts you before they become problems, preventing financial surprises.',
    priority: 'medium',
    complexity: 'low',
    status: 'planned',
    phase: 'Phase 2: Decision Frameworks & Planning',
  },
  {
    id: 'savings-goals',
    title: 'Savings Goals & Milestones',
    description:
      'Track progress toward specific savings goals with milestone celebrations and progress visualization to maintain momentum.',
    priority: 'medium',
    complexity: 'low',
    status: 'planned',
    phase: 'Phase 2: Decision Frameworks & Planning',
  },
  {
    id: 'expense-categorization',
    title: 'Smart Expense Categorization',
    description:
      'AI-powered automatic categorization of expenses with learning capabilities to reduce manual categorization work.',
    priority: 'medium',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 2: Decision Frameworks & Planning',
  },

  // Phase 3: Execution Discipline & Systems
  {
    id: 'habit-tracking',
    title: 'Financial Habit Tracking',
    description:
      'Track financial habits (daily spending reviews, weekly budget checks) to build consistency and disciplined execution.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 3: Execution Discipline & Systems',
  },
  {
    id: 'accountability-system',
    title: 'Accountability & Progress Tracking',
    description:
      "Visual progress tracking for financial goals with accountability checkpoints to help you stay on track even when it's hard.",
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 3: Execution Discipline & Systems',
  },
  {
    id: 'automated-alerts',
    title: 'Intelligent Financial Alerts',
    description:
      'Smart alerts for budget overruns, unusual spending patterns, and goal milestones to keep you informed without overwhelming you.',
    priority: 'medium',
    complexity: 'low',
    status: 'planned',
    phase: 'Phase 3: Execution Discipline & Systems',
  },
  {
    id: 'recurring-transactions',
    title: 'Recurring Transaction Management',
    description:
      'Automatically detect and manage recurring bills and subscriptions, helping you identify and cancel unused services.',
    priority: 'medium',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 3: Execution Discipline & Systems',
  },
  {
    id: 'spending-insights',
    title: 'Spending Pattern Insights',
    description:
      'AI-powered insights into your spending patterns, identifying trends and opportunities to optimize your financial behavior.',
    priority: 'medium',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 3: Execution Discipline & Systems',
  },
  {
    id: 'mobile-app',
    title: 'Mobile App for On-the-Go Command',
    description:
      'Native mobile app for iOS and Android to track expenses, check budgets, and make financial decisions from anywhere.',
    priority: 'medium',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 3: Execution Discipline & Systems',
  },

  // Phase 4: Advanced Command Systems
  {
    id: 'investment-tracking',
    title: 'Investment Portfolio Tracking',
    description:
      'Track investments, retirement accounts, and portfolio performance to get a complete picture of your financial future.',
    priority: 'low',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 4: Advanced Command Systems',
  },
  {
    id: 'debt-payoff-planner',
    title: 'Debt Payoff Strategy Planner',
    description:
      'Strategic debt payoff planning with multiple strategy options (snowball, avalanche) to help you become debt-free faster.',
    priority: 'low',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 4: Advanced Command Systems',
  },
  {
    id: 'tax-planning',
    title: 'Tax Planning & Optimization',
    description:
      'Tax planning tools to help you optimize your tax strategy throughout the year, not just during tax season.',
    priority: 'low',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 4: Advanced Command Systems',
  },
  {
    id: 'financial-coaching',
    title: 'Integrated Financial Coaching',
    description:
      'Access to financial coaches and advisors through the platform for personalized guidance on breaking out of survival mode.',
    priority: 'low',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 4: Advanced Command Systems',
  },

  // Phase 5: AI-Powered Features
  {
    id: 'your-va-claims',
    title: 'Your VA Claims',
    description:
      'Live preview from VA Benefits Claims API - Real-time access to your VA benefits claims status and information.',
    priority: 'high',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'advanced-notification-system',
    title: 'Advanced Notification System',
    description:
      'Multi-channel notifications (email, SMS, push) with smart scheduling, quiet hours, and personalized alert preferences.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'voice-first-claims-assistant',
    title: 'Voice-First Claims Assistant',
    description:
      'Complete voice interface for claims filing with natural language processing, voice-to-text transcription, and hands-free navigation.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'ai-powered-knowledge-base',
    title: 'AI-Powered Knowledge Base',
    description:
      'Dynamic knowledge base that learns from veteran interactions and provides personalized, context-aware guidance.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'reddit-dataset-integration',
    title: 'Reddit Dataset Integration for AI Agent',
    description:
      'Scrape and integrate r/veteransbenefits Q&A dataset to provide AI agent with real-world context. Includes automated scraping, full-text search, and automatic tagging of posts by topic (disability, C&P, DD-214, etc.).',
    priority: 'high',
    complexity: 'medium',
    status: 'completed',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'veteran-mentorship-network',
    title: 'Veteran Mentorship Network',
    description:
      'Structured mentorship program connecting veterans with similar experiences, service branches, and claim types.',
    priority: 'high',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'predictive-deadline-management',
    title: 'Predictive Deadline Management',
    description:
      'AI-powered deadline prediction and management with automatic extension filing and proactive compliance alerts.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'claims-analytics-dashboard',
    title: 'Claims Analytics Dashboard',
    description:
      'Advanced analytics showing claim success patterns, VA processing trends, and personalized success probability modeling.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'integrated-health-records',
    title: 'Integrated Health Records',
    description:
      'Secure integration with VA health systems for automatic medical evidence gathering and claim support.',
    priority: 'high',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'comprehensive-benefits-optimizer',
    title: 'Comprehensive Benefits Optimizer',
    description:
      'AI-driven benefits optimization that considers all available programs, eligibility stacking, and maximum benefit utilization.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'smart-evidence-discovery',
    title: 'Smart Evidence Discovery',
    description:
      'AI-powered evidence gathering that proactively identifies relevant documents, witnesses, and supporting materials.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'multi-language-veteran-support',
    title: 'Multi-Language Veteran Support',
    description:
      'Complete localization for Spanish, Vietnamese, Korean, and other languages spoken by veteran communities.',
    priority: 'medium',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'predictive-career-transition',
    title: 'Predictive Career Transition',
    description:
      'AI-powered career counseling and transition support with veteran-specific job matching and skills assessment.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'education-benefits-maximizer',
    title: 'Education Benefits Maximizer',
    description:
      'Comprehensive GI Bill optimization with school selection, degree planning, and stipend management.',
    priority: 'medium',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'home-loan-assistance-hub',
    title: 'Home Loan Assistance Hub',
    description:
      'Complete VA home loan support including pre-approval, lender matching, and purchase assistance.',
    priority: 'medium',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'appeal-strategy-optimizer',
    title: 'Appeal Strategy Optimizer',
    description:
      'Advanced appeal strategy engine that analyzes case law, success rates, and recommends optimal appeal pathways.',
    priority: 'medium',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'real-time-claims-radar',
    title: 'Real-time Claims Radar',
    description:
      'Push notifications and digest emails for VA status changes powered by the upcoming live data sync service.',
    priority: 'high',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'va-form-submission-hardening',
    title: 'VA Form Submission Hardening',
    description:
      'Productionize the new VA submission pipelines with better metrics, retries, and sandbox-to-prod parity before opening access broadly.',
    priority: 'medium',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'byok-reliability-usage-guardrails',
    title: 'BYOK Reliability & Usage Guardrails',
    description:
      'Tighten encryption, validation, and usage tracking for bring-your-own-key flows so heavy chat users stay under quota without surprises.',
    priority: 'high',
    complexity: 'low',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'claims-records-sync-service',
    title: 'Claims & Records Sync Service',
    description:
      'Foundational service that keeps disability ratings, DD-214 extracts, and award letters current so the assistant always has trusted context.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
  {
    id: 'pdf-workflow-observability',
    title: 'PDF Workflow Observability',
    description:
      'Deep instrumentation across Smart Autofill, draft autosave, and submission modals to catch regressions before they hit production.',
    priority: 'medium',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 5: AI-Powered Features',
  },
]

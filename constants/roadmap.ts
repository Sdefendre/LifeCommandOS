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
  // Phase 1: Core Functionality
  {
    id: 'supabase-db',
    title: 'Supabase Database Integration',
    description:
      'Replace localStorage with Supabase PostgreSQL database for robust data persistence.',
    priority: 'high',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 1: Core Functionality',
  },
  {
    id: 'auth-system',
    title: 'Authentication System',
    description: 'Implement full user authentication (email, OAuth) using Supabase Auth.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 1: Core Functionality',
  },
  {
    id: 'bank-integration',
    title: 'Bank Account Integration',
    description: 'Connect bank accounts via Plaid for automatic transaction imports.',
    priority: 'high',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 1: Core Functionality',
  },
  {
    id: 'notifications',
    title: 'Notification System',
    description: 'In-app and email notifications for important financial events.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 1: Core Functionality',
  },
  {
    id: 'pwa',
    title: 'Progressive Web App (PWA)',
    description: 'Make the app installable with offline capabilities.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 1: Core Functionality',
  },

  // Phase 2: Enhanced Features
  {
    id: 'ai-categorization',
    title: 'AI-Powered Categorization',
    description: 'Automatically categorize transactions using machine learning.',
    priority: 'high',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 2: Enhanced Features',
  },
  {
    id: 'advanced-reports',
    title: 'Advanced Reports',
    description: 'Comprehensive financial reports with export functionality.',
    priority: 'medium',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 2: Enhanced Features',
  },
  {
    id: 'investment-tracking',
    title: 'Investment Tracking',
    description: 'Track stocks, crypto, and portfolio performance.',
    priority: 'medium',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 2: Enhanced Features',
  },
  {
    id: 'debt-management',
    title: 'Debt Management',
    description: 'Tools to track and plan debt payoff strategies.',
    priority: 'medium',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 2: Enhanced Features',
  },
  {
    id: 'mobile-optimization',
    title: 'Mobile Optimization',
    description: 'Enhanced mobile experience with touch-optimized controls.',
    priority: 'medium',
    complexity: 'low',
    status: 'planned',
    phase: 'Phase 2: Enhanced Features',
  },

  // Phase 3: Advanced Features
  {
    id: 'ai-assistant',
    title: 'Financial AI Assistant',
    description: 'Chat-based AI assistant for financial advice and queries.',
    priority: 'medium',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 3: Advanced Features',
  },
  {
    id: 'custom-dashboards',
    title: 'Custom Dashboards',
    description: 'Drag-and-drop widget system for personalized dashboards.',
    priority: 'low',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 3: Advanced Features',
  },
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    description: 'System management and user administration panel.',
    priority: 'medium',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 3: Advanced Features',
  },
  {
    id: 'test-suite',
    title: 'Comprehensive Test Suite',
    description: 'Full unit, integration, and E2E test coverage.',
    priority: 'high',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 3: Advanced Features',
  },
  {
    id: 'api-webhooks',
    title: 'Public API & Webhooks',
    description: 'Developer tools for external integrations.',
    priority: 'low',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 3: Advanced Features',
  },

  // Phase 4: Nice-to-Have
  {
    id: 'community',
    title: 'Community Features',
    description: 'Forums and social features for financial tips.',
    priority: 'low',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 4: Future / Nice-to-Have',
  },
  {
    id: 'tax-prep',
    title: 'Tax Preparation',
    description: 'Tax categorization and report generation.',
    priority: 'low',
    complexity: 'high',
    status: 'planned',
    phase: 'Phase 4: Future / Nice-to-Have',
  },
  {
    id: 'credit-score',
    title: 'Credit Score Integration',
    description: 'Track and monitor credit score changes.',
    priority: 'low',
    complexity: 'medium',
    status: 'planned',
    phase: 'Phase 4: Future / Nice-to-Have',
  },
  {
    id: 'social-sharing',
    title: 'Milestone Sharing',
    description: 'Share financial achievements and goals.',
    priority: 'low',
    complexity: 'low',
    status: 'planned',
    phase: 'Phase 4: Future / Nice-to-Have',
  },
  {
    id: 'feature-flags',
    title: 'Feature Flags',
    description: 'System for gradual feature rollouts.',
    priority: 'low',
    complexity: 'low',
    status: 'planned',
    phase: 'Phase 4: Future / Nice-to-Have',
  },
]

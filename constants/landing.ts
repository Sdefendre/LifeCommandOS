export const LANDING_HERO = {
  badge: 'Built by Veterans, For Veterans',
  title1: 'Stop Surviving.',
  title2: 'Start Commanding Your Benefits.',
  description:
    'AI-powered education for veterans ready to escape survival mode and unlock financial freedom.',
  subDescription:
    "Confused about your DD-214? Overwhelmed by C&P exams? Broke after EAS? We've been there. Let's navigate your service-connected benefits together.",
  primaryCta: 'Start Learning Free',
  secondaryCta: 'See How It Works',
  trust: {
    badge: 'Free Command',
    items: ['No credit card required', 'Veteran-owned & operated'],
  },
  stats: [
    { label: 'Veterans Served', value: '2.5K+' },
    { label: 'Success Rate', value: '94%' },
    { label: 'AI-Powered', value: '24/7' },
  ],
}

export const LANDING_FEATURES = {
  title: 'From Confusion → Clarity → Freedom',
  description:
    'Stop navigating the VA system alone. Our AI-powered platform transforms confusion about your benefits into clear action steps toward financial freedom.',
  items: [
    {
      title: 'CommandAI',
      description:
        'Chat with Command about VA benefits, disability claims, and transition resources. Get instant answers to questions about your DD-214, C&P exams, and service-connected ratings.',
      iconName: 'MessageSquare',
      gradient: 'from-[#506464] to-[#657832]',
    },
    {
      title: 'Educational Pathways',
      description:
        'Structured learning modules on financial literacy for veterans. Master your benefits, understand your rating, and build the financial foundation you deserve.',
      iconName: 'GraduationCap',
      gradient: 'from-[#657832] to-[#78823c]',
    },
    {
      title: 'Claim Strategy Builder',
      description:
        'Tools to understand the service-connected disability process. Learn how to navigate the VA system and maximize your benefits (premium course reveals the complete strategy).',
      iconName: 'Target',
      gradient: 'from-[#506464] to-[#657832]',
    },
    {
      title: 'Transition Roadmap',
      description:
        'Step-by-step guidance from EAS to financial stability. Navigate the confusing transition period with clear, actionable steps tailored to your situation.',
      iconName: 'Map',
      gradient: 'from-[#785a3c] to-[#b4a078]',
    },
    {
      title: 'Community Access',
      description:
        "Connect with other veterans on the same journey. Share experiences, ask questions, and learn from those who've successfully navigated the system.",
      iconName: 'Users',
      gradient: 'from-[#657832] to-[#b4a078]',
    },
    {
      title: 'Secure & Private',
      description:
        'Bank-level encryption protects your data. Veteran-owned and operated. Your information stays private and secure, always under your control.',
      iconName: 'Lock',
      gradient: 'from-[#785a3c] to-[#506464]',
    },
  ],
}

export const LANDING_CTA = {
  badge: 'Systemize Success',
  titlePrefix: 'Ready to Take',
  titleHighlight: 'Command?',
  description:
    'Drifting is a liability. Command is an asset. Equip yourself with the tools for discipline, precision, and resilience. Join the community of operators today.',
  primaryCta: 'Deploy System',
  secondaryCta: 'Access Documentation',
  footer: 'No credit card required • Full control • Always accessible',
}

export const LANDING_TESTIMONIALS = {
  title: 'Trusted by Veterans Nationwide',
  description:
    "Join thousands of veterans who've escaped survival mode and unlocked financial freedom",
  items: [
    {
      name: 'Mike Thompson',
      role: 'Army Veteran, 82nd Airborne',
      content:
        'After EAS, I was broke and confused about my benefits. Command helped me understand my DD-214 and file my first claim. Went from 0% to 70% rating in 6 months. This platform changed my life.',
      rating: 5,
      avatar: 'MT',
    },
    {
      name: 'Jennifer Martinez',
      role: 'Navy Veteran, Corpsman',
      content:
        'I was overwhelmed by the VA system and C&P exams. The course gave me the exact strategy I needed. Finally got my 100% rating after years of fighting. Worth every penny.',
      rating: 5,
      avatar: 'JM',
    },
    {
      name: 'David Chen',
      role: 'Marine Veteran, Infantry',
      content:
        "The transition roadmap saved me. I went from survival mode to actually building wealth. The community support and AI agent answered questions I didn't even know to ask. Built by vets who get it.",
      rating: 5,
      avatar: 'DC',
    },
  ],
}

export const LANDING_ROADMAP = {
  title: 'Product Roadmap',
  description:
    "Our vision for the future of Command. We're building a comprehensive system to help you master your finances and life.",
}

export const LANDING_PRICING = {
  title: 'Choose Your Path',
  description:
    'Start free with Command, or unlock premium features to maximize your service-connected benefits.',
  tiers: [
    {
      title: 'Free',
      price: '$0',
      period: '',
      description: 'Start your journey with free AI-powered education',
      features: [
        'CommandAI (10 queries/day)',
        'Basic educational content',
        'Transition resources library',
        'Community forum access (read-only)',
        'DD-214 guidance',
      ],
      buttonText: 'Get Started Free',
      highlight: false,
      href: '/command',
    },
    {
      title: 'Pro',
      price: '$20',
      period: '/mo',
      description: 'Unlimited access for serious veterans',
      features: [
        'Unlimited CommandAI queries',
        'Full educational library',
        'Community full access',
        'Priority support',
        'C&P exam preparation guide',
        'Monthly strategy sessions',
      ],
      buttonText: 'Go Pro',
      highlight: true,
      href: '/api/stripe/checkout?plan=pro',
    },
    {
      title: 'Lifetime',
      price: '$50',
      period: ' one-time',
      description: 'The complete blueprint to financial freedom',
      features: [
        'Everything in Pro, forever',
        'The 0-100% Disability Rating Course',
        'Step-by-step claim strategy',
        'Lifetime course access',
        '1-on-1 onboarding call',
        'Priority feature requests',
      ],
      buttonText: 'Get Lifetime Access',
      highlight: false,
      href: '/api/stripe/checkout?plan=lifetime',
    },
  ],
}

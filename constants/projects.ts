export type ProjectLinks = {
  live?: string
  code?: string
}

export type Project = {
  title: string
  tag: string
  desc: string
  metrics?: string
  links: ProjectLinks
}

export const PROJECTS: Project[] = [
  {
    title: 'WealthWise',
    tag: 'Finance App',
    desc: 'A comprehensive personal finance BattleStation featuring transaction tracking, budget management, interactive reports, and savings goals. Built with React 19, Next.js 16, and Recharts.',
    metrics: 'BattleStation • Data Visualization • React 19',
    links: {
      live: '/battlestation',
    },
  },
  {
    title: 'Defendre Solutions',
    tag: 'Software Agency',
    desc: 'Veteran-owned software development company specializing in AI, automation, and modern web solutions for small businesses.',
    metrics: 'Veteran Owned • AI & Automation • Full Stack',
    links: {
      live: 'https://defendresolutions.com',
    },
  },
  {
    title: 'Life Command OS',
    tag: 'Personal Portfolio',
    desc: 'My personal digital headquarters. A comprehensive portfolio and blog built with Next.js 15, Tailwind CSS, and Framer Motion.',
    metrics: 'Open Source • Next.js 15 • Personal Identity',
    links: {
      live: 'https://steve-os.vercel.app',
    },
  },
  {
    title: 'Braids by Rose',
    tag: 'Business Website',
    desc: 'Professional hair braiding business website with online booking system, gallery showcase, and mobile-optimized design.',
    metrics: '300% increase in bookings • 2-week delivery • 5-star client review',
    links: {
      live: 'https://braidsbyrose.com',
    },
  },
]

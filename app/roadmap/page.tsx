import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Product Roadmap - Life Command OS',
  description: 'Future plans and feature roadmap for Life Command OS.',
}

export default function RoadmapPage() {
  redirect('/features#roadmap')
}

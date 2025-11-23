import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Changelog - Life Command OS',
  description: 'All notable changes and updates to Life Command OS.',
}

export default function ChangelogPage() {
  redirect('/features#changelog')
}

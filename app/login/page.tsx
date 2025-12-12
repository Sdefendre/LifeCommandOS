import { Suspense } from 'react'
import Link from 'next/link'
import { LoginForm } from '@/components/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your Command account to access AI-powered veteran benefits assistance.',
}

function LoginContent({ searchParams }: { searchParams: { redirect?: string; error?: string } }) {
  const redirectTo = searchParams.redirect || '/command'

  return (
    <Card className="w-full max-w-md border-2">
      <CardHeader className="text-center">
        <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Command</span>
        </Link>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
        {searchParams.error === 'auth' && (
          <p className="text-sm text-destructive mt-2">Authentication failed. Please try again.</p>
        )}
        {searchParams.error === 'configuration' && (
          <p className="text-sm text-destructive mt-2">
            Server configuration error. Please contact support.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <LoginForm redirectTo={redirectTo} />
      </CardContent>
    </Card>
  )
}

export default async function LoginPage(props: {
  searchParams: Promise<{ redirect?: string; error?: string }>
}) {
  const searchParams = await props.searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Suspense
        fallback={<div className="w-full max-w-md h-96 animate-pulse bg-muted rounded-lg" />}
      >
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

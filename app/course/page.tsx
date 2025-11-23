import { SiteHeader } from '@/components/SiteHeader'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { SubtleThreeBackgroundWrapper } from '@/components/SubtleThreeBackgroundWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Medal, Target, BookOpen, Clock, Users } from 'lucide-react'
import { CheckoutButton } from '@/components/CheckoutButton'

export const metadata = {
  title: '0-100% Service-Connected Disability Rating Course - Life Command OS',
  description:
    'The complete blueprint to maximize your service-connected disability rating. Step-by-step strategy from 0% to 100%.',
}

const courseFeatures = [
  'Complete step-by-step claim filing strategy',
  'C&P exam preparation guide',
  'How to maximize your rating percentage',
  'Documentation and evidence gathering',
  'Appeals process if needed',
  'Lifetime access to course materials',
  'Community support and Q&A',
  'Regular updates as VA policies change',
]

const courseModules = [
  {
    title: 'Understanding Your DD-214',
    description: 'Learn how to read and leverage your service record',
    duration: '15 min',
  },
  {
    title: 'Service-Connected Conditions',
    description: 'Identify and document all service-connected conditions',
    duration: '30 min',
  },
  {
    title: 'C&P Exam Mastery',
    description: 'Complete guide to preparing for and acing your C&P exam',
    duration: '45 min',
  },
  {
    title: 'Claim Filing Strategy',
    description: 'Step-by-step process to file your claim correctly',
    duration: '30 min',
  },
  {
    title: 'Maximizing Your Rating',
    description: 'Advanced strategies to combine conditions and maximize percentage',
    duration: '45 min',
  },
  {
    title: 'Appeals and Reconsideration',
    description: 'What to do if your claim is denied or underrated',
    duration: '30 min',
  },
]

export default function CoursePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <SubtleThreeBackgroundWrapper />
      <SiteHeader />

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <Badge className="mb-4 px-4 py-2 text-sm">Premium Course</Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            From 0% to 100% Service-Connected Disability Rating
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6">
            The complete blueprint to maximize your service-connected benefits and unlock financial
            freedom. Built by veterans who've successfully navigated the system.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>3+ hours of content</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>6 comprehensive modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>2,500+ veterans enrolled</span>
            </div>
          </div>
        </div>

        {/* What You'll Learn */}
        <Card className="glass mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">What You'll Learn</CardTitle>
            <CardDescription>
              This course reveals the complete strategy that has helped thousands of veterans
              maximize their service-connected disability rating.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {courseFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Course Modules</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {courseModules.map((module, index) => (
              <Card
                key={index}
                className="glass hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription className="mt-2">{module.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="shrink-0 ml-4">
                      {module.duration}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="glass border-primary/30 bg-primary/5">
          <CardHeader className="text-center">
            <Medal className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl">Ready to Maximize Your Benefits?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of veterans who've successfully navigated from 0% to 100% rating
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="text-4xl font-bold mb-2">One-Time Payment</div>
              <div className="text-muted-foreground">
                Lifetime access • 30-day money-back guarantee
              </div>
            </div>
            <CheckoutButton size="lg" className="text-lg px-10 py-6">
              Enroll Now
            </CheckoutButton>
            <p className="text-xs text-muted-foreground mt-4">
              Secure checkout powered by Stripe. Your information is safe and encrypted.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Secure checkout powered by Stripe. Your information is safe and encrypted.
            </p>
          </CardContent>
        </Card>

        {/* Testimonial */}
        <Card className="glass mt-12">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Target className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="text-muted-foreground italic mb-2">
                  "I was stuck at 30% for years. This course gave me the exact strategy I needed. I
                  followed the steps, prepared properly for my C&P exam, and got my 100% rating. The
                  financial freedom this has given me is life-changing."
                </p>
                <p className="text-sm font-semibold">— Marine Veteran, 100% Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <LandingFooter />
    </div>
  )
}

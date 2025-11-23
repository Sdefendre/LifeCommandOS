'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  CreditCard,
  Calendar,
  PieChart,
  Shield,
  BarChart3,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SiteHeader } from '@/components/SiteHeader'

const features = [
  {
    title: 'Financial Mastery',
    description:
      'Track every penny with our advanced financial dashboard. Visualize your spending and savings in real-time.',
    icon: PieChart,
  },
  {
    title: 'Smart Budgeting',
    description:
      'Set custom budgets for different categories and get alerted when you are close to your limits.',
    icon: CreditCard,
  },
  {
    title: 'Calendar Sync',
    description:
      'Seamlessly integrate with Google Calendar to keep your financial and personal life in perfect harmony.',
    icon: Calendar,
  },
  {
    title: 'Secure & Private',
    description:
      'Your data is encrypted and stored securely. We prioritize your privacy above all else.',
    icon: Shield,
  },
]

const pricingFeatures = [
  'Unlimited Transaction History',
  'Advanced Analytics & Reports',
  'Google Calendar Integration',
  'CSV Data Import/Export',
  'Priority Email Support',
  'Custom Budget Categories',
  'Multiple Currency Support',
  'Mobile-Optimized Dashboard',
]

export default function SaaSLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 sm:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-background to-background opacity-40" />

          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge
                  variant="outline"
                  className="mb-6 px-4 py-1.5 text-sm font-medium rounded-full border-red-500/50 text-red-500 bg-red-500/10 uppercase tracking-wider"
                >
                  Escape Survival Mode
                </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                  Stop Surviving. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 animate-gradient-x">
                    Start Commanding.
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                  Life Command OS is your intelligent command center. An AI agent built for those
                  who've spent too long fighting to stay afloat. Stabilize your money, eliminate
                  chaos, and build your future.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-lg shadow-red-900/20 hover:shadow-red-900/40 transition-all duration-300 bg-red-600 hover:bg-red-700 text-white border-0"
                    >
                      Take Command <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#pricing">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-2 hover:bg-secondary/50"
                    >
                      View Mission Plans
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Hero Image / Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-20 relative mx-auto max-w-5xl"
            >
              <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden p-2 sm:p-4">
                <div className="aspect-video rounded-lg bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center relative overflow-hidden group">
                  {/* Abstract representation of dashboard */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                  <div className="relative z-10 text-center p-8">
                    <Shield className="h-20 w-20 text-red-600 mx-auto mb-4 opacity-80" />
                    <p className="text-2xl font-bold text-white tracking-widest uppercase">
                      Command Center Active
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Never be broke, lost, or overwhelmed again.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We don't just track numbers. We give you a survival-to-stability game plan.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Leak Spotter',
                  description:
                    'Automatically tracks income, bills, and subscriptions to spot spending leaks before they drain you.',
                  icon: PieChart,
                },
                {
                  title: '90-Day Runway',
                  description:
                    'Build a fortress around your finances. We help you construct a 90-day stability runway so you never panic.',
                  icon: Shield,
                },
                {
                  title: 'Weekly Missions',
                  description:
                    'Get clear, actionable missions for your money, habits, and goals. No vague advice, just orders.',
                  icon: Check,
                },
                {
                  title: 'Command Coach',
                  description:
                    'An AI that talks to you like a coach, not a calculator. It commands action and keeps you accountable.',
                  icon: Zap,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-border/50 bg-card/50 hover:bg-card transition-colors duration-300">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 text-red-600">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 relative">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground">
                Invest in your future for less than the cost of a coffee a week.
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-30" />

                <Card className="relative border-primary/20 shadow-2xl bg-card">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm shadow-lg">
                      Most Popular
                    </Badge>
                  </div>

                  <CardHeader className="text-center pt-10 pb-8 border-b border-border/50">
                    <CardTitle className="text-2xl font-bold mb-2">Pro Access</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-extrabold">$20</span>
                      <span className="text-muted-foreground text-xl">/month</span>
                    </div>
                    <CardDescription className="mt-4 text-base">
                      Unlock the full potential of Life Command OS
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-8 pb-10 px-8">
                    <ul className="space-y-4 mb-8">
                      {pricingFeatures.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3 text-green-500" />
                          </div>
                          <span className="text-sm sm:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full py-6 text-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all"
                      size="lg"
                    >
                      Subscribe Now
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      30-day money-back guarantee. Cancel anytime.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to take control?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of users who are already managing their lives with Life Command OS.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="default"
                className="text-lg px-10 py-6 rounded-full shadow-xl"
              >
                Start Your Journey
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border bg-background">
          <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-xl mb-2">Life Command OS</h3>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Life Command OS. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const pricingTiers = [
  {
    title: 'Civilian',
    price: '$0',
    description: 'Basic system access for casual users',
    features: [
      'Last 30 Days Transaction History',
      'Basic Analytics',
      'Manual Data Entry',
      'Community Support',
      'Standard Dashboard',
    ],
    buttonText: 'Get Started',
    highlight: false,
  },
  {
    title: 'Command Access',
    price: '$20',
    description: 'Unlock full system capabilities',
    features: [
      'Unlimited Transaction History',
      'Advanced Analytics & Reports',
      'Google Calendar Integration',
      'CSV Data Import/Export',
      'Priority Email Support',
      'Custom Budget Categories',
    ],
    buttonText: 'Activate Access',
    highlight: true,
  },
  {
    title: 'Elite Vanguard',
    price: '$50',
    description: 'For power users demanding total control',
    features: [
      'Everything in Command Access',
      'AI-Powered Financial Insights',
      'Weekly Strategy Calls',
      'Early Access to New Features',
      'Dedicated Account Manager',
      'White-glove Onboarding',
    ],
    buttonText: 'Join Elite',
    highlight: false,
  },
]

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Operational Costs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the level of control that fits your mission. From basic reconnaissance to full
            command authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${tier.highlight ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {tier.highlight && (
                <>
                  {/* Glow effect for highlighted tier */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="absolute top-0 right-0 left-0 flex justify-center -mt-3 z-10">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm shadow-lg">
                      Recommended
                    </Badge>
                  </div>
                </>
              )}

              <Card
                className={`relative h-full flex flex-col ${
                  tier.highlight
                    ? 'border-primary/50 shadow-2xl bg-card/50 backdrop-blur-sm'
                    : 'border-border/50 shadow-lg bg-card/30 hover:bg-card/50'
                } transition-all duration-300 hover:-translate-y-1`}
              >
                <CardHeader className="text-center pt-10 pb-8 border-b border-border/50">
                  <CardTitle className="text-2xl font-bold mb-2">{tier.title}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold">{tier.price}</span>
                    <span className="text-muted-foreground text-xl">/month</span>
                  </div>
                  <CardDescription className="mt-4 text-base min-h-[50px]">
                    {tier.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-8 pb-10 px-6 flex-grow flex flex-col">
                  <ul className="space-y-4 mb-8 flex-grow">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            tier.highlight ? 'bg-green-500/20' : 'bg-muted'
                          }`}
                        >
                          <Check
                            className={`h-3 w-3 ${
                              tier.highlight ? 'text-green-500' : 'text-muted-foreground'
                            }`}
                          />
                        </div>
                        <span className="text-sm text-left">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-6 text-lg font-semibold shadow-lg transition-all ${
                      tier.highlight
                        ? 'bg-primary hover:bg-primary/90 hover:shadow-primary/25'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    size="lg"
                  >
                    {tier.buttonText}
                  </Button>

                  {tier.highlight && (
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      30-day operational guarantee.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

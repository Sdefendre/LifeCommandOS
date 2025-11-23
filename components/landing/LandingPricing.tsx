'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const pricingTiers = [
  {
    title: 'Free Tier',
    price: '$0',
    description: 'Start your journey with free AI-powered education',
    features: [
      'Command (limited queries)',
      'Basic educational content',
      'Transition resources library',
      'Community forum access (read-only)',
      'DD-214 guidance',
      'Basic C&P exam information',
    ],
    buttonText: 'Get Started Free',
    highlight: false,
  },
  {
    title: 'Premium Course',
    price: 'One-Time',
    description: 'The complete blueprint to financial freedom',
    features: [
      'Full AI agent access (unlimited)',
      'Complete educational library',
      'The 0-100% Service-Connected Disability Rating Course',
      'Community full access',
      'Priority support',
      'Step-by-step claim strategy',
      'C&P exam preparation guide',
      'Lifetime course access',
    ],
    buttonText: 'Enroll Now',
    highlight: true,
  },
]

export function LandingPricing() {
  return (
    <section id="pricing" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background gradients for glass effect visibility */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-3 sm:px-4 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Choose Your Path
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free with Command, or unlock the complete strategy to maximize your
            service-connected benefits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-150" />
                  <div className="absolute top-0 right-0 left-0 flex justify-center -mt-2 sm:-mt-3 z-10">
                    <Badge className="bg-primary text-primary-foreground px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-lg">
                      Recommended
                    </Badge>
                  </div>
                </>
              )}

              <Card
                className={`relative h-full flex flex-col glass ${
                  tier.highlight
                    ? 'border-primary/30 shadow-2xl bg-white/15 dark:bg-black/15 hover:bg-white/20 dark:hover:bg-black/20 ring-2 ring-primary/20'
                    : 'border-white/20 dark:border-white/10 shadow-lg hover:bg-white/15 dark:hover:bg-black/15'
                } transition-all duration-150 hover:-translate-y-1 group`}
              >
                <CardHeader className="text-center pt-8 sm:pt-10 pb-6 sm:pb-8 border-b border-border/50 px-4 sm:px-6 relative overflow-hidden">
                  {tier.highlight && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-[#785a3c]/10 opacity-50 group-hover:opacity-75 transition-opacity duration-150" />
                  )}
                  <div className="relative z-10">
                    <CardTitle className="text-xl sm:text-2xl font-bold mb-2">
                      {tier.title}
                    </CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#657832] to-[#78823c] bg-clip-text text-transparent">
                        {tier.price}
                      </span>
                      {tier.price !== '$0' && (
                        <span className="text-muted-foreground text-lg sm:text-xl"> payment</span>
                      )}
                    </div>
                    <CardDescription className="mt-3 sm:mt-4 text-sm sm:text-base min-h-[50px]">
                      {tier.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 sm:pt-8 pb-8 sm:pb-10 px-4 sm:px-6 flex-grow flex flex-col">
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
                    className={`w-full py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-lg transition-all ${
                      tier.highlight
                        ? 'bg-primary hover:bg-primary/90 hover:shadow-primary/25'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    size="lg"
                    onClick={() => {
                      if (tier.highlight) {
                        window.location.href = '/course'
                      } else {
                        window.location.href = '/ai-agent'
                      }
                    }}
                  >
                    {tier.buttonText}
                  </Button>

                  {tier.highlight && (
                    <p className="text-xs text-center text-muted-foreground mt-3 sm:mt-4">
                      30-day money-back guarantee. Lifetime access.
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

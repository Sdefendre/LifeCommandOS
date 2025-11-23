'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Shield, Check, Zap } from 'lucide-react'

const features = [
  {
    title: 'Resource Leak Detection',
    description:
      'Automated surveillance of income, bills, and subscriptions. Identify and plug financial leaks before they compromise your stability.',
    icon: PieChart,
  },
  {
    title: 'Stability Fortress Protocol',
    description:
      'Construct a defensive financial perimeter. We assist in building a 90-day runway to ensure operational continuity.',
    icon: Shield,
  },
  {
    title: 'Tactical Directives',
    description:
      'Receive clear, actionable weekly missions. No vague advice—just precise orders to optimize your finances and habits.',
    icon: Check,
  },
  {
    title: 'Strategic AI Advisor',
    description:
      'An intelligent system that communicates like a commander, not a calculator. It demands action and enforces accountability.',
    icon: Zap,
  },
]

export function LandingFeatures() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradients for glass effect visibility */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/40 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Eliminate Uncertainty. Execute with Precision.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Data without action is noise. Life Command OS transforms metrics into missions, ensuring
            you never operate blind again.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-white/20 dark:border-white/10 glass hover:bg-white/20 dark:hover:bg-white/10 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
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
  )
}

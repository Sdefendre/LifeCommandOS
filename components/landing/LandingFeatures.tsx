'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, GraduationCap, Target, Map, Users, Lock } from 'lucide-react'

const features = [
  {
    title: 'Command',
    description:
      'Chat with Command about VA benefits, disability claims, and transition resources. Get instant answers to questions about your DD-214, C&P exams, and service-connected ratings.',
    icon: MessageSquare,
    gradient: 'from-[#506464] to-[#657832]',
  },
  {
    title: 'Educational Pathways',
    description:
      'Structured learning modules on financial literacy for veterans. Master your benefits, understand your rating, and build the financial foundation you deserve.',
    icon: GraduationCap,
    gradient: 'from-[#657832] to-[#78823c]',
  },
  {
    title: 'Claim Strategy Builder',
    description:
      'Tools to understand the service-connected disability process. Learn how to navigate the VA system and maximize your benefits (premium course reveals the complete strategy).',
    icon: Target,
    gradient: 'from-[#506464] to-[#657832]',
  },
  {
    title: 'Transition Roadmap',
    description:
      'Step-by-step guidance from EAS to financial stability. Navigate the confusing transition period with clear, actionable steps tailored to your situation.',
    icon: Map,
    gradient: 'from-[#785a3c] to-[#b4a078]',
  },
  {
    title: 'Community Access',
    description:
      'Connect with other veterans on the same journey. Share experiences, ask questions, and learn from those who&apos;ve successfully navigated the system.',
    icon: Users,
    gradient: 'from-[#657832] to-[#b4a078]',
  },
  {
    title: 'Secure & Private',
    description:
      'Bank-level encryption protects your data. Veteran-owned and operated. Your information stays private and secure, always under your control.',
    icon: Lock,
    gradient: 'from-[#785a3c] to-[#506464]',
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background gradients for glass effect visibility */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/40 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 not-italic font-sans">
            From Confusion → Clarity → Freedom
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop navigating the VA system alone. Our AI-powered platform transforms confusion about
            your benefits into clear action steps toward financial freedom.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-white/20 dark:border-white/10 glass hover:bg-white/20 dark:hover:bg-white/10 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-150 group cursor-default shadow-lg relative overflow-hidden">
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-150 -z-10`}
                />
                <CardHeader>
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-150 shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary-gradient transition-colors duration-150">
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

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Mike Thompson',
    role: 'Army Veteran, 82nd Airborne',
    content:
      'After EAS, I was broke and confused about my benefits. Command helped me understand my DD-214 and file my first claim. Went from 0% to 70% rating in 6 months. This platform changed my life.',
    rating: 5,
    avatar: 'MT',
  },
  {
    name: 'Jennifer Martinez',
    role: 'Navy Veteran, Corpsman',
    content:
      'I was overwhelmed by the VA system and C&P exams. The course gave me the exact strategy I needed. Finally got my 100% rating after years of fighting. Worth every penny.',
    rating: 5,
    avatar: 'JM',
  },
  {
    name: 'David Chen',
    role: 'Marine Veteran, Infantry',
    content:
      "The transition roadmap saved me. I went from survival mode to actually building wealth. The community support and AI agent answered questions I didn't even know to ask. Built by vets who get it.",
    rating: 5,
    avatar: 'DC',
  },
]

export function LandingTestimonials() {
  return (
    <section className="py-24 relative overflow-hidden bg-muted/30">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Trusted by Veterans Nationwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of veterans who've escaped survival mode and unlocked financial freedom
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full glass hover:shadow-xl hover:-translate-y-1 transition-all duration-150 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10" />
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ROADMAP_ITEMS, RoadmapItem } from '@/constants/roadmap'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react'

export function LandingRoadmap() {
  // Group items by phase
  const phases = React.useMemo(() => {
    const groups: Record<string, RoadmapItem[]> = {}
    ROADMAP_ITEMS.forEach((item) => {
      if (!groups[item.phase]) {
        groups[item.phase] = []
      }
      groups[item.phase].push(item)
    })
    return groups
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      default:
        return 'secondary'
    }
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradients for glass effect visibility */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Product Roadmap</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our vision for the future of Life Command OS. We're building a comprehensive system to
            help you master your finances and life.
          </p>
        </div>

        <div className="space-y-16">
          {Object.entries(phases).map(([phaseName, items], index) => (
            <motion.div
              key={phaseName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 sm:pl-0"
            >
              {/* Timeline connector for mobile/tablet */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border sm:hidden" />

              <div className="mb-8 flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold border border-primary/20 z-10 sm:relative -ml-[16.5px] sm:ml-0 bg-background">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{phaseName}</h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="relative overflow-hidden border-l-4 glass hover:shadow-xl hover:bg-white/15 dark:hover:bg-black/15 transition-all duration-150 h-full flex flex-col"
                  >
                    {/* Status Indicator Stripe */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${
                        item.status === 'completed'
                          ? 'bg-green-500'
                          : item.status === 'in-progress'
                            ? 'bg-blue-500'
                            : 'bg-muted'
                      }`}
                    />

                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg font-semibold leading-tight">
                          {item.title}
                        </CardTitle>
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Badge
                          variant={getPriorityColor(item.priority) as any}
                          className="text-[10px] px-1.5 py-0 h-5"
                        >
                          {item.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                          {item.complexity.toUpperCase()} CMPLX
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow pt-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

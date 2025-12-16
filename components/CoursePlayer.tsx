'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { CourseModule } from './CourseContent'

interface CoursePlayerProps {
  modules: CourseModule[]
  courseId?: string
  userId?: string
}

export function CoursePlayer({
  modules,
  courseId = '0-100-rating-course',
  userId,
}: CoursePlayerProps) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch progress on mount
  useEffect(() => {
    async function fetchProgress() {
      if (!userId) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/course/progress?userId=${userId}&courseId=${courseId}`)
        if (response.ok) {
          const data = await response.json()
          // data.progress is array of { module_id: string, ... }
          if (data.progress && Array.isArray(data.progress)) {
            const completedIds = new Set<string>(
              data.progress.map((p: any) => p.module_id as string)
            )
            setCompletedModules(completedIds)
          }
        }
      } catch (error) {
        console.error('Failed to load course progress:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgress()
  }, [userId, courseId])

  useEffect(() => {
    // Calculate progress
    const completed = completedModules.size
    const total = modules.length
    setProgress(total > 0 ? (completed / total) * 100 : 0)
  }, [completedModules, modules.length])

  const currentModule = modules[currentModuleIndex]
  const hasNext = currentModuleIndex < modules.length - 1
  const hasPrev = currentModuleIndex > 0

  const handleNext = () => {
    if (hasNext) {
      setCurrentModuleIndex(currentModuleIndex + 1)
    }
  }

  const handlePrev = () => {
    if (hasPrev) {
      setCurrentModuleIndex(currentModuleIndex - 1)
    }
  }

  const handleComplete = async () => {
    const moduleId = currentModule.id
    setCompletedModules((prev) => new Set(prev).add(moduleId))

    // Save progress to database
    if (userId) {
      try {
        await fetch('/api/course/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            courseId,
            moduleId,
            completed: true,
          }),
        })
      } catch (error) {
        console.error('Error saving progress:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Sidebar - Module List */}
      <div className="lg:w-80 shrink-0">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Course Progress</CardTitle>
            <div className="mt-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {completedModules.size} of {modules.length} modules completed
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {modules.map((module, index) => {
                const isCompleted = completedModules.has(module.id)
                const isCurrent = index === currentModuleIndex
                return (
                  <button
                    key={module.id}
                    onClick={() => setCurrentModuleIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-primary/20 border border-primary/30'
                        : 'hover:bg-muted/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{module.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{module.duration}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Card className="glass h-full flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{currentModule.title}</CardTitle>
                <CardDescription>{currentModule.description}</CardDescription>
              </div>
              <Badge variant="outline">{currentModule.duration}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 prose prose-sm dark:prose-invert max-w-none">
              {currentModule.content}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button variant="outline" onClick={handlePrev} disabled={!hasPrev}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                {!completedModules.has(currentModule.id) && (
                  <Button onClick={handleComplete} variant="outline">
                    Mark Complete
                  </Button>
                )}
                {hasNext ? (
                  <Button onClick={handleNext}>
                    Next Module
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button disabled={!completedModules.has(currentModule.id)}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Course Complete!
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

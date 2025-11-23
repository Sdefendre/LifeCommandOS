import { SiteHeader } from '@/components/SiteHeader'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { AIAgentChat } from '@/components/AIAgentChat'
import { VoiceAgent } from '@/components/VoiceAgent'
import { SubtleThreeBackgroundWrapper } from '@/components/SubtleThreeBackgroundWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Medal, MessageSquare, Shield } from 'lucide-react'

export const metadata = {
  title: 'Command - Life Command OS',
  description: 'Chat with Command about VA benefits, disability claims, and transition resources.',
}

export default function AIAgentPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <SubtleThreeBackgroundWrapper />
      <SiteHeader />

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-6xl">
        <div className="max-w-3xl mx-auto mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">Command</h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Get instant answers about VA benefits, disability claims, C&P exams, and your DD-214.
              Built by veterans, for veterans.
            </p>
          </div>

          {/* Quick Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="glass">
              <CardHeader className="pb-3">
                <Medal className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-base">Service-Connected Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Understand your rating, file claims, and maximize your benefits.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardHeader className="pb-3">
                <Shield className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-base">C&P Exam Prep</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Learn what to expect and how to prepare for your Compensation & Pension exam.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardHeader className="pb-3">
                <MessageSquare className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-base">Transition Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Get guidance on navigating life after EAS and building financial stability.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chat and Voice Interface */}
        <Card className="glass max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Start Your Conversation</CardTitle>
            <CardDescription>
              Choose text chat or voice conversation. Ask me anything about VA benefits, disability
              claims, or your transition. I&apos;m here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Text Chat</TabsTrigger>
                <TabsTrigger value="voice">Voice Conversation</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="mt-4">
                <AIAgentChat />
              </TabsContent>
              <TabsContent value="voice" className="mt-4">
                <VoiceAgent />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <LandingFooter />
    </div>
  )
}

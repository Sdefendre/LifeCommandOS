import { MainHeader } from '@/components/MainHeader'
import { AIAgentChat } from '@/components/AIAgentChat'
import { VoiceAgent } from '@/components/VoiceAgent'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SubtleThreeBackgroundWrapper } from '@/components/SubtleThreeBackgroundWrapper'

export const metadata = {
  title: 'Command Interface - Life Command OS',
  description: 'Direct interface for Command AI. Ask about VA benefits, claims, and transition.',
}

export default function CommandPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <SubtleThreeBackgroundWrapper />
      <MainHeader />

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-6 max-w-5xl flex flex-col">
        <div className="flex-1 flex flex-col">
          <Card className="glass flex-1 flex flex-col border-0 sm:border bg-background/60 sm:bg-background/40 backdrop-blur-xl shadow-none sm:shadow-lg">
            <CardHeader className="pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl sm:text-2xl">Command Interface</CardTitle>
                  <CardDescription className="hidden sm:block">
                    Secure, private, and veteran-focused AI assistance.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 sm:p-6 overflow-hidden flex flex-col min-h-[600px]">
              <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
                <div className="px-4 sm:px-0 mb-4">
                  <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
                    <TabsTrigger value="chat">Text Chat</TabsTrigger>
                    <TabsTrigger value="voice">Voice Mode</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="chat"
                  className="flex-1 mt-0 min-h-0 data-[state=active]:flex flex-col"
                >
                  <div className="flex-1 relative rounded-md border bg-background/50 overflow-hidden">
                    <AIAgentChat />
                  </div>
                </TabsContent>

                <TabsContent
                  value="voice"
                  className="flex-1 mt-0 min-h-0 data-[state=active]:flex flex-col"
                >
                  <div className="flex-1 flex items-center justify-center rounded-md border bg-background/50 p-6">
                    <VoiceAgent />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

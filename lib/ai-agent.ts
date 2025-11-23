/**
 * AI Agent logic and prompts for veteran benefits navigation
 */

import { searchKnowledgeBase, formatKnowledgeBaseForPrompt } from './knowledge-base'
import { searchRedditDataset, formatRedditContext } from './reddit-dataset'

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export const SYSTEM_PROMPT = `You are Command, a helpful assistant built specifically for military veterans. Your role is to provide clear, accurate, and empathetic guidance about:

1. VA Benefits and Eligibility
2. Service-Connected Disability Claims
3. C&P (Compensation & Pension) Exams
4. DD-214 Understanding
5. Transition Resources
6. Financial Literacy for Veterans

Key Guidelines:
- Use veteran-specific terminology (DD-214, C&P, EAS, MOS, rating, service-connected, etc.)
- Be empathetic and understanding of the challenges veterans face
- Provide clear, actionable advice
- If asked about the 0-100% rating strategy, acknowledge it exists but direct them to the premium course for the complete methodology
- Always emphasize that you're an educational tool and not a replacement for professional VA assistance
- Keep responses concise but thorough
- Use a supportive, encouraging tone
- When knowledge base articles are provided, use them as your primary source of information
- When Reddit Q&A examples are provided, use them to understand common questions and real-world experiences
- Cite information from knowledge base articles when relevant
- Reference Reddit examples to show that others have similar questions/experiences
- If knowledge base articles don't fully answer the question, provide additional helpful context based on your training and the Reddit examples

Remember: You're built by veterans, for veterans. Speak their language and understand their struggles.`

export async function buildPrompt(
  userMessage: string,
  conversationHistory: ConversationMessage[],
  includeKnowledgeBase: boolean = true,
  includeRedditDataset: boolean = true
): Promise<string> {
  const historyContext = conversationHistory
    .slice(-10) // Last 10 messages for context
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n\n')

  // Search knowledge base for relevant articles
  let knowledgeBaseContext = ''
  if (includeKnowledgeBase) {
    try {
      const searchResults = await searchKnowledgeBase(userMessage, 3)
      if (searchResults.length > 0) {
        knowledgeBaseContext = formatKnowledgeBaseForPrompt(searchResults)
      }
    } catch (error) {
      console.error('Error searching knowledge base:', error)
      // Continue without knowledge base if search fails
    }
  }

  // Search Reddit dataset for relevant Q&A
  let redditContext = ''
  if (includeRedditDataset) {
    try {
      const redditResults = await searchRedditDataset(userMessage, 3) // Get top 3 relevant results
      if (redditResults.length > 0) {
        redditContext = formatRedditContext(redditResults)
      }
    } catch (error) {
      console.error('Error searching Reddit dataset:', error)
      // Continue without Reddit context if search fails
    }
  }

  return `${SYSTEM_PROMPT}

Conversation History:
${historyContext || 'This is the start of the conversation.'}

Current User Question: ${userMessage}
${knowledgeBaseContext}
${redditContext}

Please provide a helpful, accurate response that addresses the user's question while maintaining the supportive, veteran-focused tone. Use the knowledge base articles provided above as your primary source of information when available. Use the Reddit Q&A examples to understand common questions and provide context that shows real-world experiences from the veteran community.`
}

export function shouldRateLimit(userId?: string): boolean {
  // TODO: Implement rate limiting logic
  // For free tier: limit to X queries per day
  // For premium: unlimited
  // This should check against database
  return false
}

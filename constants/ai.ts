export type ModelOption =
  | 'grok-4.1-fast'
  | 'grok-4-fast-reasoning'
  | 'grok-4-fast-non-reasoning'
  | 'gpt-5.1'
  | 'gpt-4o-mini'
  | 'gpt-4o'

export const MODEL_OPTIONS: { value: ModelOption; label: string; description: string }[] = [
  {
    value: 'gpt-5.1',
    label: 'GPT-5.1',
    description: "OpenAI's latest and most advanced model",
  },
  {
    value: 'grok-4.1-fast',
    label: 'Grok 4.1 Fast',
    description: 'Latest Grok model - fast & capable',
  },
  {
    value: 'grok-4-fast-reasoning',
    label: 'Grok 4 Fast (Reasoning)',
    description: 'Deep reasoning & complex problem-solving',
  },
  {
    value: 'grok-4-fast-non-reasoning',
    label: 'Grok 4 Fast (Speed)',
    description: 'Optimized for speed & straightforward queries',
  },
  {
    value: 'gpt-4o',
    label: 'GPT-4o',
    description: "OpenAI's most capable model",
  },
  {
    value: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    description: 'Fast & cost-efficient',
  },
]

export type ModelOption = 'grok-4-1-fast-reasoning' | 'gpt-4o' | 'gpt-4o-mini'

export const DEFAULT_MODEL: ModelOption = 'gpt-4o-mini'

export const MODEL_OPTIONS: { value: ModelOption; label: string; description: string }[] = [
  {
    value: 'gpt-4o',
    label: 'GPT-4o',
    description: "OpenAI's flagship multimodal model",
  },
  {
    value: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    description: 'Fast & cost-efficient',
  },
  {
    value: 'grok-4-1-fast-reasoning',
    label: 'Grok 4.1 Fast',
    description: "xAI's fast reasoning model",
  },
]

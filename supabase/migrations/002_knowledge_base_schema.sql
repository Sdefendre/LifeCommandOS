-- Migration: Knowledge Base Schema
-- Description: Creates knowledge base table for AI agent to reference when answering questions

-- Knowledge Base Table
-- Stores articles, FAQs, and reference information for the AI agent
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'dd214', 'cp-exam', 'disability-claims', 'transition', 'benefits'
  tags TEXT[], -- Array of tags for better searchability
  keywords TEXT[], -- Array of keywords that trigger this article
  priority INTEGER DEFAULT 0, -- Higher priority articles shown first
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_keywords ON knowledge_base USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_active ON knowledge_base(is_active);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_priority ON knowledge_base(priority DESC);

-- Enable full-text search on title and content
CREATE INDEX IF NOT EXISTS idx_knowledge_base_fulltext ON knowledge_base 
  USING GIN(to_tsvector('english', title || ' ' || content));

-- Enable Row Level Security (RLS)
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Knowledge base is publicly readable (for AI agent use)
CREATE POLICY "Knowledge base is publicly readable"
  ON knowledge_base FOR SELECT
  USING (is_active = TRUE);

-- Function to update updated_at timestamp
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();





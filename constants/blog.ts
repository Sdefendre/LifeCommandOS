// Import all blog posts from separate files
import { post7 } from '@/blog_posts/post7'
import { post8, post9 } from '@/blog_posts/posts8-9'
import { post10 } from '@/blog_posts/post10'
import { posts11to15 as posts11to12 } from '@/blog_posts/posts11-12'
import { post13 } from '@/blog_posts/post13'
import { postTeslaMP4 } from '@/blog_posts/tesla-masterplan-part-4'
import { postAfterScarcity } from '@/blog_posts/after-scarcity'
import { youtubeVideos } from '@/blog_posts/youtube-videos'
import { rebrandingPost } from '@/blog_posts/rebranding'

export const BLOG_POSTS = [
  rebrandingPost,
  postAfterScarcity,
  ...youtubeVideos,
  {
    id: 'claude-code-game-changer',
    title: 'Claude Code: A Game-Changer for Veteran-Owned Software Development',
    excerpt:
      'How Claude Code is revolutionizing the way we approach software development at Defendre Solutions, from rapid prototyping to production deployment.',
    content: `
      <p>As a veteran-owned software development firm, we're always looking for tools that can help us deliver exceptional results to our clients while maintaining the discipline and efficiency that military service taught us. Enter Claude Code – a tool that has fundamentally changed how we approach software development at Defendre Solutions.</p>

      <h3>What Makes Claude Code Different</h3>
      <p>Claude Code isn't just another AI coding assistant. It's a comprehensive development environment that understands context, follows best practices, and can work alongside you as a true coding partner. Here's what sets it apart:</p>

      <ul>
        <li><strong>Contextual Understanding:</strong> Claude Code reads your entire codebase, understands your project structure, and maintains consistency with your existing patterns.</li>
        <li><strong>Military-Grade Precision:</strong> Just like military operations, every suggestion is calculated, purposeful, and aligned with mission objectives.</li>
        <li><strong>Full-Stack Capabilities:</strong> From frontend React components to backend API design, Claude Code handles the complete development lifecycle.</li>
      </ul>

      <h3>Real-World Impact at Defendre Solutions</h3>
      <p>Since integrating Claude Code into our workflow, we've seen remarkable improvements:</p>

      <ul>
        <li><strong>50% faster development cycles</strong> for new features</li>
        <li><strong>Reduced debugging time</strong> through better code quality from the start</li>
        <li><strong>Enhanced documentation</strong> that actually stays up-to-date</li>
        <li><strong>Improved client satisfaction</strong> through faster delivery and higher quality</li>
      </ul>

      <h3>For Our Military Community</h3>
      <p>As veterans transitioning into tech or current service members looking to upskill, Claude Code offers something special. It teaches while it codes, explaining concepts and best practices in a way that builds your expertise over time.</p>

      <p>The tool respects the systematic approach we learned in the military while introducing modern development practices that are essential in today's tech landscape.</p>

      <h3>Looking Forward</h3>
      <p>At Defendre Solutions, we're committed to leveraging cutting-edge tools like Claude Code to deliver superior results for our clients. Whether you're a startup needing an MVP or an enterprise requiring mission-critical software, we combine military discipline with AI-powered development to exceed expectations.</p>

      <p>Ready to see what modern AI-assisted development can do for your project? <a href="#contact" class="text-blue-400 hover:text-blue-300">Get in touch</a> – we'd love to show you what's possible.</p>
    `,
    author: 'Steve Defendre',
    date: '2025-03-01',
    readTime: '5 min read',
    tags: ['AI Development', 'Claude Code', 'Veteran Tech', 'Software Development'],
  },
  // Tesla Master Plan Part 4 preview & analysis
  postTeslaMP4,
  // Additional long-form posts from separate files
  post13,
  post7,
  post8,
  post9,
  post10,
  ...posts11to12,
]

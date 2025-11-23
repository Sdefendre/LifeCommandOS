# Life Command OS

**Personal Operating System & Portfolio**

Life Command OS is the digital home of Steve Defendre, showcasing projects, thoughts, and services. Built with Next.js 15, Tailwind CSS, and Framer Motion.

## 🚀 Live Demo

Visit: [Life Command OS](https://steve-os.vercel.app)

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI**: Shadcn UI, Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Calendar**: Google Calendar API, React Day Picker
- **Data Processing**: PapaParse (CSV parsing)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sdefendre/LifeCommandOS.git
   cd LifeCommandOS
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the project root:

   ```env
   # AI Agent - Required for AI chat functionality
   OPENAI_API_KEY=your_openai_api_key_here
   XAI_API_KEY=your_xai_api_key_here  # Optional, for Grok models

   # Supabase - Required for rate limiting, knowledge base, and Reddit dataset
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key  # For server-side operations

   # Google Calendar Integration (Optional)
   GOOGLE_CALENDAR_API_KEY=your_api_key_here
   GOOGLE_CALENDAR_ID=primary

   # Newsletter (if using email functionality)
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_email
   SMTP_PASS=your_password
   ```

   **Getting API Keys:**
   - **OpenAI API Key** (Required):
     - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
     - Sign in or create an account
     - Create a new API key
     - Copy the key and add it to your `.env.local` file
   - **XAI API Key** (Optional, for Grok models):
     - Visit [X.AI Console](https://console.x.ai/)
     - Sign in or create an account
     - Navigate to API Keys section
     - Create a new API key
     - Copy the key and add it to your `.env.local` file
   - **Supabase Setup** (Required for full functionality):
     - Visit [Supabase](https://supabase.com/)
     - Create a new project or use an existing one
     - Go to Project Settings → API
     - Copy the Project URL and anon/public key
     - For service role key: Go to Project Settings → API → Service Role key (keep this secret!)
     - Add all three values to your `.env.local` file
     - See [Supabase Setup Guide](./docs/SUPABASE_SETUP.md) for database schema setup

   See [GOOGLE_CALENDAR_SETUP.md](./GOOGLE_CALENDAR_SETUP.md) for detailed calendar setup instructions.

4. **Install GitHub CLI (Optional but recommended)**

   On macOS (using Homebrew):

   ```bash
   brew install gh
   ```

   On other platforms, visit: [GitHub CLI Installation](https://cli.github.com/manual/installation)

   After installation, authenticate:

   ```bash
   gh auth login
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

## 🤖 MCP (Model Context Protocol) Setup

This project uses MCP servers to enable AI assistants to interact with external services.

### GitHub MCP Server

The GitHub MCP server allows AI assistants to interact with GitHub repositories, issues, and pull requests.

**Prerequisites:**

1. **Node.js**: Ensure Node.js is installed (already required for this project)
   - Verify installation: `node --version`

2. **GitHub Personal Access Token**: Create a token with the following permissions:
   - `repo` (Full control of private repositories)
   - `read:packages` (Read packages)
   - `read:org` (Read org and team membership)

   To create a token:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select the required scopes
   - Copy the token (you won't be able to see it again)

**Setup:**

1. Set the GitHub token as an environment variable:

   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
   ```

   Or add it to your shell profile (`.zshrc`, `.bashrc`, etc.):

   ```bash
   echo 'export GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here' >> ~/.zshrc
   source ~/.zshrc
   ```

2. Restart Cursor to load the MCP configuration

The GitHub MCP server is configured in `.cursor/mcp.json` and will automatically start when Cursor connects to MCP servers. It uses `npx` to run the server, so no Docker installation is required.

### Linear MCP Server

The Linear MCP server allows AI assistants to interact with Linear issues, create new issues, and manage your Linear workspace directly from Cursor.

**Prerequisites:**

1. **Node.js**: Ensure Node.js is installed (already required for this project)
   - Verify installation: `node --version`

2. **Linear Account**: You need a Linear account to authorize the MCP server

**Setup:**

1. The Linear MCP server is already configured in `.cursor/mcp.json` and will automatically start when Cursor connects to MCP servers.

2. **Authorize with Linear:**
   - When you first use the Linear MCP server, Cursor will open a web browser
   - Follow the on-screen instructions to authorize the connection with your Linear account
   - This is a one-time setup process

3. **Activate the Server:**
   - Press `CTRL/CMD + P` and search for `MCP: List Servers`
   - Select `Linear` from the list
   - Choose `Start Server` to initiate the connection

4. Restart Cursor if needed to load the MCP configuration

**Project Connection:**

This repository is connected to the **Life Command OS** project in Linear:

- **Linear Project URL**: [https://linear.app/ceceriforma/project/life-command-os-113a92ca8686](https://linear.app/ceceriforma/project/life-command-os-113a92ca8686)
- **Team**: Ceceriforma
- **Project ID**: `cea70c7e-066a-4e85-931c-2e5983067453`

**Usage:**

Once configured, you can use the Linear MCP server to:

- List Linear issues related to this project
- Create new Linear issues linked to the Life Command OS project
- Update existing issues
- Search for issues by various criteria

Example prompts:

- "List all issues in the Life Command OS project"
- "Create a new Linear issue for this bug in the Life Command OS project"
- "Show me all open issues in the Life Command OS project"
- "Create an issue for [feature description] and add it to the Life Command OS project"

## 🔧 GitHub CLI Usage

This project uses GitHub CLI for various operations. You can use GitHub CLI commands directly or through pnpm scripts:

### Direct GitHub CLI Commands

- **View repository info**: `gh repo view`
- **Create a new issue**: `gh issue create`
- **List issues**: `gh issue list`
- **View pull requests**: `gh pr list`
- **Create a pull request**: `gh pr create`
- **Check repository status**: `gh repo status`

### PNPM Scripts (GitHub CLI shortcuts)

- **Check repo status**: `pnpm gh:status`
- **List issues**: `pnpm gh:issues`
- **List pull requests**: `pnpm gh:prs`
- **View repository**: `pnpm gh:view`

## 📊 Dashboard Features

Life Command OS includes a comprehensive financial dashboard (`/dashboard`) with:

- **Financial Overview**: Track balance, spending, budget, and savings goals
- **Transaction Management**: View and manage recent transactions
- **Budget Tracking**: Monitor spending across categories (Food, Transport, Shopping, Bills)
- **Data Visualization**: Interactive charts showing spending trends and category breakdowns
- **CSV Import**: Upload bank statements (CSV) to automatically import transactions
- **Calendar Integration**: View upcoming events from Google Calendar
- **Responsive Design**: Fully responsive dashboard with sidebar navigation

### Dashboard Routes

- `/dashboard` - Main dashboard overview
- `/dashboard/transactions` - Transaction history
- `/dashboard/budgets` - Budget management
- `/dashboard/reports` - Financial reports
- `/dashboard/savings` - Savings goals tracking
- `/dashboard/balance` - Balance details

## 📅 Google Calendar Integration

The dashboard includes Google Calendar integration for viewing upcoming events. See [GOOGLE_CALENDAR_SETUP.md](./GOOGLE_CALENDAR_SETUP.md) for setup instructions.

## 🎯 Features Page

The `/features` page provides a comprehensive overview of all Life Command OS features, including:

- **Current Features**: Overview of all available features (Command AI chat, Educational Pathways, Claim Strategy Builder, Transition Roadmap, Community Access, Secure & Private)
- **Product Roadmap**: Interactive roadmap showing planned features and improvements
- **Changelog**: Complete project changelog automatically parsed from `CHANGELOG.md`
- **Responsive Design**: Fully responsive layout with Three.js background effects

Access the features page at `/features` from the main navigation.

## 🔧 Performance Optimizations

### Client-Only Components

The project uses lazy loading for non-critical client-side components to improve initial page load performance:

- **ClientOnlyComponents**: Wraps components that require browser APIs (ScrollToTop, ChatFloatingButton)
- **Dynamic Imports**: Uses Next.js dynamic imports with `ssr: false` for browser-only components
- **Suspense Boundaries**: Homepage uses Suspense for progressive loading

Components like `ScrollToTop` and `ChatFloatingButton` are loaded only on the client side to avoid hydration issues and improve performance.

## 📄 License

Proprietary to Steve Defendre.

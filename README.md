# SteveOS

**Personal Operating System & Portfolio**

SteveOS is the digital home of Steve Defendre, showcasing projects, thoughts, and services. Built with Next.js 15, Tailwind CSS, and Framer Motion.

## 🚀 Live Demo

Visit: [SteveOS](https://steve-os.vercel.app)

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI**: Shadcn UI, Lucide React
- **Animations**: Framer Motion

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sdefendre/SteveOS.git
   cd SteveOS
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install GitHub CLI (Optional but recommended)**

   On macOS (using Homebrew):

   ```bash
   brew install gh
   ```

   On other platforms, visit: [GitHub CLI Installation](https://cli.github.com/manual/installation)

   After installation, authenticate:

   ```bash
   gh auth login
   ```

4. **Start development server**
   ```bash
   npm run dev
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

## 🔧 GitHub CLI Usage

This project uses GitHub CLI for various operations. You can use GitHub CLI commands directly or through npm scripts:

### Direct GitHub CLI Commands

- **View repository info**: `gh repo view`
- **Create a new issue**: `gh issue create`
- **List issues**: `gh issue list`
- **View pull requests**: `gh pr list`
- **Create a pull request**: `gh pr create`
- **Check repository status**: `gh repo status`

### NPM Scripts (GitHub CLI shortcuts)

- **Check repo status**: `npm run gh:status`
- **List issues**: `npm run gh:issues`
- **List pull requests**: `npm run gh:prs`
- **View repository**: `npm run gh:view`

## 📄 License

Proprietary to Steve Defendre.

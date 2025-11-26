import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`)
  config({ path: envPath })
} else {
  console.log('No .env.local file found. Checking process environment...')
}

const requiredVars = ['OPENAI_API_KEY', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']

const optionalVars = [
  'XAI_API_KEY', // For Grok models
  'SUPABASE_SERVICE_ROLE_KEY', // For server-side rate limiting/admin
]

console.log('\n--- Checking AI Command Environment Variables ---\n')

let missingRequired = false

requiredVars.forEach((varName) => {
  if (process.env[varName]) {
    console.log(`✅ ${varName} is set`)
    if (varName === 'OPENAI_API_KEY' && !process.env[varName]?.startsWith('sk-')) {
      console.warn(
        `   ⚠️  ${varName} does not look like a standard OpenAI key (should start with sk-)`
      )
    }
  } else {
    console.error(`❌ ${varName} is MISSING`)
    missingRequired = true
  }
})

console.log('\n--- Optional Variables ---\n')

optionalVars.forEach((varName) => {
  if (process.env[varName]) {
    console.log(`✅ ${varName} is set`)
  } else {
    console.log(`⚠️  ${varName} is not set (some features might be limited)`)
  }
})

console.log('\n----------------------------------------------')

if (missingRequired) {
  console.error('\n❌ Configuration incomplete. The AI Command Chat will NOT work.')
  console.log('Please add the missing variables to your .env.local file.')
  process.exit(1)
} else {
  console.log('\n✅ Configuration looks good! The AI Command Chat should work.')
  console.log('Run "npm run dev" and visit http://localhost:3000/command to test.')
}

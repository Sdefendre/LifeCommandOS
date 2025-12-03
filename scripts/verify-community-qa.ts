/**
 * Verification script for Community Q&A dataset
 *
 * This script checks if the Community Q&A dataset is properly set up and working.
 *
 * Usage: npm run verify-community-qa
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { join } from 'path'
import { searchCommunityQA, getDatasetStats } from '../lib/community-qa'

// Load environment variables
dotenv.config({ path: join(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function verifySetup() {
  console.log('🔍 Verifying Community Q&A Dataset Setup...\n')

  // Check environment variables
  console.log('1. Checking environment variables...')
  if (!SUPABASE_URL) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set')
    return false
  }
  if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set')
    return false
  }
  console.log('✅ Environment variables are set\n')

  // Check database connection
  console.log('2. Checking database connection...')
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  try {
    const { data, error } = await supabase.from('community_qa_dataset').select('id').limit(1)

    if (error) {
      console.error('❌ Database connection failed:', error.message)
      if (error.message.includes('relation "community_qa_dataset" does not exist')) {
        console.error('   → The migration has not been applied yet!')
        console.error('   → Run: supabase migration up')
        console.error('   → Or apply supabase/migrations/004_rename_to_community_qa.sql manually')
      }
      return false
    }
    console.log('✅ Database connection successful\n')
  } catch (error) {
    console.error('❌ Database connection error:', error)
    return false
  }

  // Check if search function exists
  console.log('3. Checking search function...')
  try {
    const { data, error } = await supabase.rpc('search_community_qa', {
      search_query: 'test',
      result_limit: 1,
    })

    if (error) {
      console.warn('⚠️  Search function not found (will use fallback search):', error.message)
      console.log('   → This is okay - fallback search will be used\n')
    } else {
      console.log('✅ Search function exists\n')
    }
  } catch (error) {
    console.warn('⚠️  Could not test search function:', error)
    console.log('   → Fallback search will be used\n')
  }

  // Check dataset stats
  console.log('4. Checking dataset...')
  try {
    const stats = await getDatasetStats()
    console.log(`   Total Posts: ${stats.totalPosts}`)
    console.log(`   Posts with Answers: ${stats.totalAnswers}`)
    console.log(`   Average Upvotes: ${stats.averageUpvotes}`)
    console.log(
      `   Top Tags: ${stats.topTags.length > 0 ? stats.topTags.map((t) => t.tag).join(', ') : 'None'}`
    )

    if (stats.totalPosts === 0) {
      console.log('\n⚠️  Dataset is empty!')
      console.log('   → Run: npm run scrape-community-qa')
      console.log('   → This will populate the dataset with community Q&A\n')
    } else {
      console.log('✅ Dataset has data\n')
    }
  } catch (error) {
    console.error('❌ Error getting dataset stats:', error)
    return false
  }

  // Test search functionality
  console.log('5. Testing search functionality...')
  try {
    const testQueries = ['disability claim', 'C&P exam', 'DD-214']

    for (const query of testQueries) {
      const results = await searchCommunityQA(query, 1)
      if (results.length > 0) {
        console.log(`   ✅ "${query}" → Found ${results.length} result(s)`)
      } else {
        console.log(`   ⚠️  "${query}" → No results (dataset may be empty or needs more data)`)
      }
    }
    console.log('')
  } catch (error) {
    console.error('❌ Search test failed:', error)
    return false
  }

  // Final summary
  console.log('📊 Summary:')
  console.log('   ✅ Database connection: Working')
  console.log('   ✅ Dataset table: Exists')
  console.log('   ✅ Search functionality: Working')

  const stats = await getDatasetStats()
  if (stats.totalPosts === 0) {
    console.log('   ⚠️  Dataset: Empty (run scraper to populate)')
  } else {
    console.log(`   ✅ Dataset: ${stats.totalPosts} posts available`)
  }

  console.log('\n🎉 Setup verification complete!')
  return true
}

// Run verification
if (require.main === module) {
  verifySetup()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { verifySetup }

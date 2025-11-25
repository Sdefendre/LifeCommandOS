const http = require('http')

const BASE_URL = process.argv[2] || 'http://localhost:3000'

const routes = ['/', '/battlestation', '/blog', '/ai-agent']

async function checkRoute(route) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${route}`
    console.log(`Checking ${url}...`)

    const req = http.get(url, (res) => {
      console.log(`  Status: ${res.statusCode}`)
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve(true)
      } else {
        console.error(`  Failed: Status code ${res.statusCode}`)
        resolve(false)
      }
    })

    req.on('error', (e) => {
      console.error(`  Error: ${e.message}`)
      resolve(false)
    })
  })
}

async function run() {
  console.log(`Starting smoke test against ${BASE_URL}`)

  // Wait a bit for server to be ready if running in CI/parallel
  // (Optional, but good practice if starting server immediately before)

  let allPassed = true

  for (const route of routes) {
    const passed = await checkRoute(route)
    if (!passed) {
      allPassed = false
    }
  }

  if (allPassed) {
    console.log('✅ Smoke test passed: All routes accessible.')
    process.exit(0)
  } else {
    console.error('❌ Smoke test failed: One or more routes inaccessible.')
    process.exit(1)
  }
}

run()

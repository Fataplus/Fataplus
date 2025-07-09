/*
export default defineEventHandler(async (event) => {
  try {
    // Test what's available in the global scope
    const available = {
      env: typeof process !== 'undefined' ? process.env.NODE_ENV : 'unknown',
      globalThis: Object.keys(globalThis).filter(key => key.includes('hub') || key.includes('database')),
      nuxtHub: {
        hubDatabase: typeof hubDatabase !== 'undefined',
        hubKV: typeof hubKV !== 'undefined',
        hubBlob: typeof hubBlob !== 'undefined'
      },
      cloudflare: {
        env: typeof process.env.CLOUDFLARE !== 'undefined',
        worker: typeof process.env.CF_PAGES !== 'undefined'
      }
    }
    
    return {
      success: true,
      message: 'NuxtHub environment test',
      data: available,
      timestamp: new Date().toISOString()
    }
    
  } catch (error: any) {
    return {
      success: false,
      message: 'Test failed',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
})
*/

/**
 * Promise utilities
 */

/**
 * Add timeout to a promise
 */
export const withTimeout = (promise, ms, timeoutError = new Error('Operation timed out')) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(timeoutError), ms))
  ])
}

/**
 * Retry a promise with exponential backoff
 */
export const retry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (e) {
      lastError = e
      await new Promise(r => setTimeout(r, delay * Math.pow(2, i)))
    }
  }
  throw lastError
}

/**
 * Wait for a specified duration
 */
export const wait = (ms) => new Promise(r => setTimeout(r, ms))

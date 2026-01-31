/**
 * Test Utility Functions for StacksYield Pro
 * 
 * This file contains helper functions used across test files.
 * Updated for Clarinet SDK (not Deno-based)
 */

// Clarinet SDK types are available globally in test context

/**
 * Convert STX amount to micro-STX
 * @param amount - Amount in STX
 * @returns Amount in micro-STX
 */
export function stxToMicroStx(amount: number): number {
    return amount * 1_000_000;
}

/**
 * Convert micro-STX to STX
 * @param amount - Amount in micro-STX
 * @returns Amount in STX
 */
export function microStxToStx(amount: number): number {
    return amount / 1_000_000;
}

/**
 * Create a uint Clarity type string
 * @param value - Numeric value
 * @returns Clarity uint type string
 */
export function uint(value: number): string {
    return `u${value}`;
}

/**
 * Create a principal Clarity type string
 * @param address - Principal address
 * @returns Clarity principal type string
 */
export function principal(address: string): string {
    return `'${address}`;
}

/**
 * Helper to check if a result is OK
 * @param result - Transaction result
 * @returns Boolean indicating success
 */
export function isOk(result: any): boolean {
    return result.startsWith('(ok');
}

/**
 * Helper to check if a result is an error
 * @param result - Transaction result
 * @returns Boolean indicating error
 */
export function isErr(result: any): boolean {
    return result.startsWith('(err');
}

/**
 * Extract error code from error result
 * @param result - Error result string
 * @returns Error code as number
 */
export function getErrorCode(result: string): number | null {
    const match = result.match(/\(err u(\d+)\)/);
    return match ? parseInt(match[1]) : null;
}

/**
 * Default test vault configuration
 */
export const DEFAULT_VAULT_CONFIG = {
    name: 'Test Vault',
    minDeposit: stxToMicroStx(10),
    apy: 1000, // 10% in basis points
};

/**
 * Common error codes
 */
export const ERROR_CODES = {
    VAULT_NOT_FOUND: 100,
    INSUFFICIENT_BALANCE: 101,
    INVALID_AMOUNT: 102,
    UNAUTHORIZED: 103,
    VAULT_PAUSED: 104,
    MIN_DEPOSIT_NOT_MET: 105,
};

/**
 * Mock vault data for testing
 */
export const MOCK_VAULT = {
  id: 1,
  name: 'Conservative',
  apy: 500,  // 5%
  minDeposit: stxToMicroStx(1),
  lockPeriod: 604800, // 1 week in seconds
};

/**
 * Create a mock user deposit result
 */
export function mockDepositResult(amount: number, vaultId: number = 1) {
  return {
    amount: stxToMicroStx(amount),
    vaultId,
    timestamp: Date.now(),
  };
}

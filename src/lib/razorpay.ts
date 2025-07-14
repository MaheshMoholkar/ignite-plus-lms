import {
  CurrencyType,
  ZeroDecimalCurrency,
  ThreeDecimalCurrency,
} from "./types";

/**
 * Converts a price to Razorpay's required format (smallest currency sub-unit)
 *
 * @param amount - The price amount (e.g., 299.99)
 * @param currency - The currency code (e.g., 'INR', 'USD', 'KWD', 'JPY')
 * @returns The amount in smallest currency sub-unit (e.g., 29999 for 299.99 INR)
 *
 * Examples:
 * - INR: 299.99 → 29999 (2 decimal places)
 * - USD: 299.99 → 29999 (2 decimal places)
 * - KWD: 99.991 → 99990 (3 decimal places, last digit rounded to 0)
 * - JPY: 295 → 295 (0 decimal places)
 */
export function convertPriceForRazorpay(
  amount: number,
  currency: CurrencyType
): number {
  const currencyCode = currency.toUpperCase() as CurrencyType;

  // Zero decimal currencies (JPY, VND, etc.)
  const zeroDecimalCurrencies: ZeroDecimalCurrency[] = [
    "JPY",
    "VND",
    "KRW",
    "CLP",
    "PYG",
    "ISK",
    "BIF",
    "DJF",
    "GNF",
    "KMF",
    "MGA",
    "RWF",
    "XOF",
    "XAF",
    "XPF",
  ];

  // Three decimal currencies (KWD, BHD, OMR, etc.)
  const threeDecimalCurrencies: ThreeDecimalCurrency[] = [
    "KWD",
    "BHD",
    "OMR",
    "JOD",
    "LYD",
  ];

  if (zeroDecimalCurrencies.includes(currencyCode as ZeroDecimalCurrency)) {
    // For zero decimal currencies, return the amount as is
    return Math.round(amount);
  }

  if (threeDecimalCurrencies.includes(currencyCode as ThreeDecimalCurrency)) {
    // For three decimal currencies, multiply by 1000 and ensure last digit is 0
    const multiplied = amount * 1000;
    // Round to nearest 10 to ensure last digit is 0
    return Math.round(multiplied / 10) * 10;
  }

  // Default: two decimal currencies (INR, USD, EUR, etc.)
  // Multiply by 100 to convert to smallest sub-unit
  return Math.round(amount * 100);
}

/**
 * Converts a Razorpay amount back to the original price
 *
 * @param razorpayAmount - The amount in smallest currency sub-unit
 * @param currency - The currency code
 * @returns The original price amount
 */
export function convertRazorpayAmountToPrice(
  razorpayAmount: number,
  currency: CurrencyType
): number {
  const currencyCode = currency.toUpperCase() as CurrencyType;

  // Zero decimal currencies
  const zeroDecimalCurrencies: ZeroDecimalCurrency[] = [
    "JPY",
    "VND",
    "KRW",
    "CLP",
    "PYG",
    "ISK",
    "BIF",
    "DJF",
    "GNF",
    "KMF",
    "MGA",
    "RWF",
    "XOF",
    "XAF",
    "XPF",
  ];

  // Three decimal currencies
  const threeDecimalCurrencies: ThreeDecimalCurrency[] = [
    "KWD",
    "BHD",
    "OMR",
    "JOD",
    "LYD",
  ];

  if (zeroDecimalCurrencies.includes(currencyCode as ZeroDecimalCurrency)) {
    return razorpayAmount;
  }

  if (threeDecimalCurrencies.includes(currencyCode as ThreeDecimalCurrency)) {
    return razorpayAmount / 1000;
  }

  // Default: two decimal currencies
  return razorpayAmount / 100;
}

/**
 * Validates if a currency is supported for price conversion
 *
 * @param currency - The currency code to validate
 * @returns True if the currency is supported
 */
export function isSupportedCurrency(
  currency: string
): currency is CurrencyType {
  const supportedCurrencies: CurrencyType[] = [
    // Two decimal currencies
    "INR",
    "USD",
    "EUR",
    "GBP",
    "CAD",
    "AUD",
    "SGD",
    "AED",
    "SAR",
    "QAR",
    // Three decimal currencies
    "BHD",
    "KWD",
    "OMR",
    "JOD",
    "LYD",
    // Zero decimal currencies
    "JPY",
    "VND",
    "KRW",
    "CLP",
    "PYG",
    "ISK",
    "BIF",
    "DJF",
    "GNF",
    "KMF",
    "MGA",
    "RWF",
    "XOF",
    "XAF",
    "XPF",
  ];

  return supportedCurrencies.includes(currency.toUpperCase() as CurrencyType);
}

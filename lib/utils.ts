/**
 * Utility functions for Marathi localization and formatting.
 */

/**
 * Formats a number using the Marathi (Indian) numbering system.
 * Handles commas and Marathi numerals.
 * 
 * @param number The number or string to format
 * @returns Formatted string in Marathi numerals
 */
export const formatMarathiNumber = (number: number | string) => {
  const strValue = String(number);
  const isPercentage = strValue.includes('%');
  const cleanValue = isPercentage ? strValue.replace('%', '').trim() : strValue;
  
  const n = parseFloat(cleanValue);
  if (isNaN(n)) return replaceWithMarathiDigits(strValue);
  
  const formatted = new Intl.NumberFormat("mr-IN").format(n);
  const marathiFormatted = replaceWithMarathiDigits(formatted);
  
  return isPercentage ? `${marathiFormatted}%` : marathiFormatted;
};

/**
 * Replaces all English digits (0-9) with Marathi digits (०-९).
 * Useful for strings that contain numbers (phone numbers, IDs, years, etc.)
 * 
 * @param text The string or number to process
 * @returns String with Marathi digits
 */
export const replaceWithMarathiDigits = (text: string | number | undefined | null) => {
  if (text === undefined || text === null) return "";
  const str = String(text);
  const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return str.replace(/[0-9]/g, (w) => marathiDigits[parseInt(w)]);
};

/**
 * Formats a date string into a localized Marathi date.
 * 
 * @param dateString The date string or Date object
 * @returns Localized date string in Marathi
 */
export const formatMarathiDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return replaceWithMarathiDigits(String(dateString));
  
  return date.toLocaleDateString("mr-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

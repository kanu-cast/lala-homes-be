import { parse } from "date-fns";

/**
 * Parse a date string using multiple formats.
 * Supported formats:
 * - JavaScript's default date string format (e.g., "Sat Feb 22 2025 21:23:30 GMT+0200 (Central Africa Time)")
 * - Custom formats: dd.MM.yyyy, dd/MM/yyyy, dd-MM-yyyy, and ISO 8601.
 * Returns `null` if the date string doesn't match any of the supported formats.
 */
export const parseDate = (dateString: string): Date | null => {
  // Try parsing using JavaScript's Date constructor
  const jsDate = new Date(dateString);
  if (!isNaN(jsDate.getTime())) {
    return jsDate; // Return the valid Date object
  }

  // Try parsing using date-fns for custom formats
  const formats = ["dd.MM.yyyy", "dd/MM/yyyy", "dd-MM-yyyy", "yyyy-MM-dd"];
  for (const format of formats) {
    const parsedDate = parse(dateString, format, new Date());
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate; // Return the valid Date object
    }
  }

  return null; // Return null if no format matches
};

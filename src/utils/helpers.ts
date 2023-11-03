export type AnyType = any;

/**
 * Uppercase first char
 * @param val
 * @returns string
 */
export const ucFirst = (val: string): string => {
  return val.charAt(0).toUpperCase() + val.substring(1).toLowerCase();
};

/**
 * Parse to array
 * @param val - any
 * @returns Array
 */
export const toArray = <T extends AnyType = AnyType>(val: any): T[] => {
  return Array.isArray(val) ? val : [...val];
};

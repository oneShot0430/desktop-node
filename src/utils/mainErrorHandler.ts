export default (fn: any, errorMessage?: string): any =>
  (...args: any[]) => {
    try {
      return fn(...args);
    } catch (err) {
      console.error(err.message);
      return { error: errorMessage || err.message };
    }
  };

/**
 * @fixme
 * This is properly typed versiojn of the function, but function wrapped in that function will not always return a Promise,
 * and some usages of that function are assuming that it will return a Promise.
 * it have to be refactored.
 *
 */

// export default function tryCatch<T extends (...args: any[]) => any>(
//   fn: T,
//   errorMessage?: string
// ): (...args: Parameters<T>) => ReturnType<T> | { error: string } {
//   return (...args: Parameters<T>) => {
//     try {
//       return fn(...args);
//     } catch (err) {
//       console.error(err.message);
//       return { error: errorMessage || err.message };
//     }
//   };
// }

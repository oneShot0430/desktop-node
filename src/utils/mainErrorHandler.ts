export default <ARGS extends unknown[], T>(
    fn: (...args: ARGS) => T,
    errorMessage?: string
  ): ((...args: ARGS) => T | { error: string }) =>
  (...args: ARGS): T | { error: string } => {
    try {
      return fn(...args);
    } catch (err) {
      console.error(err.message);
      return { error: errorMessage || err.message };
    }
  };

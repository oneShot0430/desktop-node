export default (fn: any, errorMessage?: string): any =>
  (...args: any[]) => {
    try {
      return fn(...args);
    } catch (err) {
      console.error(err.message);
      return { error: errorMessage || err.message };
    }
  };

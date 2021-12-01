export default (fn: any, errorTag: string) => (...args: any[]) => {
  try {
    return fn(...args);
  } catch (err) {
    throw new Error(`${errorTag}: ${err.message}`);
  }
};

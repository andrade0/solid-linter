export const safeStringify = (obj: any) => {
  const cache = new Set();
  const replacer = (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        // Detected circular reference, replace it with a string
        return '[Circular]';
      }
      cache.add(value);
    }
    return value;
  };

  const jsonString = JSON.stringify(obj, replacer);
  cache.clear();
  return jsonString;
}

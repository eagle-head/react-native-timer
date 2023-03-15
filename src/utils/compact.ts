export function compact<T>(array: (T | null | undefined)[]): T[] {
  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (value) {
      result.push(value);
    }
  }

  return result;
}

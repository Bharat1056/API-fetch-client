export function safeMerge(
  base: Record<string, string>,
  other: Record<string, string> = {}
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in base) {
    if (Object.prototype.hasOwnProperty.call(base, key)) {
      result[key] = base[key];
    }
  }

  for (const key in other) {
    if (Object.prototype.hasOwnProperty.call(other, key)) {
      result[key] = other[key];
    }
  }

  return result;
}

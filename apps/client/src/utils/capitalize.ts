/**
 * Capitalize the first character of a string, leaving the rest unchanged.
 * Added to exercise the diff-aware PR reviewer end-to-end.
 */
export function capitalize(value: string): string {
  if (value.length === 0) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

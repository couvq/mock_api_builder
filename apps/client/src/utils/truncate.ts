/**
 * Truncate a string to `maxLength` characters, appending an ellipsis when the
 * value is longer. Used to verify the diff-aware PR reviewer on a code-only PR.
 */
export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}…`;
}

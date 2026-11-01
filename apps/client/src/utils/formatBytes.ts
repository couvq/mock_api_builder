/**
 * Format a byte count into a human-readable string (e.g. 1536 -> "1.5 KB").
 *
 * Added as a small, self-contained change to exercise the diff-aware PR reviewer.
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;
  const exponent = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, exponent);

  return `${value.toFixed(decimals)} ${units[exponent]}`;
}

export function average(nums: number[]): number {
  const sum = nums.reduce((total, n) => total + n, 0);
  return sum / nums.length;
}

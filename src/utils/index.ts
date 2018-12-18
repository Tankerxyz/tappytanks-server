export function generateRandomNumberRange(n: number) {
  return Math.round((Math.random() * (n - 1)) - ((n - 1) / 2));
}

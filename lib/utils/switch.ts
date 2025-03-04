export function switching<T extends string, R>(
  value: T,
  cases: Record<T, () => R>,
): R {
  return cases[value]();
}

export function switching<T extends string, R>(
  value: T,
  cases: Record<T, () => R>,
): R {
  if (!cases[value]) {
    console.error(`No case for value`, value, cases);
    throw new Error(`No case for value: ${value}`);
  }
  return cases[value]();
}

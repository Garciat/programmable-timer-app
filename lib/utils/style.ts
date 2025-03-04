export function ifClass(
  condition: boolean | undefined | null,
  className: string,
) {
  return condition ? className : "";
}

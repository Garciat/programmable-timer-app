export function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const f = (value: number) => value.toString().padStart(2, "0");

  return `${f(minutes)}:${f(remainingSeconds)}`;
}

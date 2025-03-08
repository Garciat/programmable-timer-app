export function readFileToString(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || typeof e.target.result !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }
      resolve(e.target.result);
    };
    reader.readAsText(file);
  });
}

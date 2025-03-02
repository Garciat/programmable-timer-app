export function stringToStream(
  value: string,
): ReadableStream<Uint8Array> {
  return new Response(value).body!;
}

export async function streamToBase64(
  stream: ReadableStream<Uint8Array>,
): Promise<string> {
  const blob = await new Response(stream).blob();

  const dataURL = await blobToDataURL(blob);

  const prefix = "data:application/octet-stream;base64,";

  if (!dataURL.startsWith(prefix)) {
    throw new Error("Failed to convert stream to base64.");
  }

  return dataURL.slice(prefix.length);
}

export async function streamFromBase64(
  base64: string,
): Promise<ReadableStream<Uint8Array>> {
  const dataURL = `data:application/octet-stream;base64,${base64}`;

  const response = await fetch(dataURL);

  return response.body!;
}

export async function streamToString(
  stream: ReadableStream<Uint8Array>,
): Promise<string> {
  return await new Response(stream).text();
}

export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

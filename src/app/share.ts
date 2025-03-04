import {
  streamFromBase64,
  streamToBase64,
  streamToString,
  stringToStream,
} from "src/utils/binary.ts";
import { TimerPresetSchema } from "src/app/schema.ts";
import { TimerPreset } from "src/app/types.ts";

const ENCODING_PLAIN_PREFIX = "p1_";
const ENCODING_COMPRESSED_PREFIX = "c1_";

export async function encodeShare(preset: TimerPreset) {
  try {
    return ENCODING_COMPRESSED_PREFIX + await encodeShareCompressedV1(preset);
  } catch (error) {
    console.error("encodeShareCompressed()", error);
    return ENCODING_PLAIN_PREFIX + encodeSharePlainV1(preset);
  }
}

export async function decodeShare(
  encoded: string,
): Promise<TimerPreset | undefined> {
  try {
    if (encoded.startsWith(ENCODING_COMPRESSED_PREFIX)) {
      return await decodeShareCompressedV1(
        encoded.slice(ENCODING_COMPRESSED_PREFIX.length),
      );
    } else if (encoded.startsWith(ENCODING_PLAIN_PREFIX)) {
      return decodeSharePlainV1(encoded.slice(ENCODING_PLAIN_PREFIX.length));
    } else {
      throw new Error("Unknown share link encoding.");
    }
  } catch (error) {
    console.error("Failed to decode share link.", error);
    return undefined;
  }
}

function encodeSharePlainV1(preset: TimerPreset) {
  const json = JSON.stringify(preset);
  return btoa(json);
}

function decodeSharePlainV1(encoded: string): TimerPreset {
  const json = atob(encoded);
  return TimerPresetSchema.parse(JSON.parse(json));
}

async function encodeShareCompressedV1(preset: TimerPreset) {
  const stream = stringToStream(JSON.stringify(preset))
    .pipeThrough(new CompressionStream("gzip"));

  return await streamToBase64(stream);
}

async function decodeShareCompressedV1(encoded: string): Promise<TimerPreset> {
  const stream = (await streamFromBase64(encoded))
    .pipeThrough(new DecompressionStream("gzip"));

  const text = await streamToString(stream);

  return TimerPresetSchema.parse(JSON.parse(text));
}

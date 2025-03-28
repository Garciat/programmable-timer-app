export function routeHome() {
  return "/";
}

export function routeNewPreset() {
  return "/presets/new";
}

export function routeEditPreset(presetId: string) {
  return `/presets/${presetId}/edit`;
}

export function routePlayPreset(
  presetId: string,
  { start }: { start?: number } = {},
) {
  let uri = `/presets/${presetId}/play`;
  if (start) {
    uri += `?start=${start}`;
  }
  return uri;
}

export function routeQrPreset(presetId: string) {
  return `/presets/${presetId}/qr`;
}

export function routeImportPreset(content: string) {
  return `/import/${content}`;
}

export function routeHistory() {
  return "/history";
}

export function routeHistoryRecord(recordId: string) {
  return `/history/record/${recordId}`;
}

export function routeHistoryRecordEdit(recordId: string) {
  return `/history/record/${recordId}/edit`;
}

export function routeSettings() {
  return "/settings";
}

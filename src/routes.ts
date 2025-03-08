export function routeHome() {
  return "/";
}

export function routeNewPreset() {
  return "/presets/new";
}

export function routeEditPreset(presetId: string) {
  return `/presets/${presetId}/edit`;
}

export function routePlayPreset(presetId: string) {
  return `/presets/${presetId}/play`;
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

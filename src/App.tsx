import { Route, Routes } from "react-router";

import { ReactAudioContextProvider } from "lib/audio/context.tsx";
import { AppStateContextProvider } from "src/state/context.tsx";
import { AppStateLocalStorage } from "src/storage/local.tsx";
import { TransientStateProvider } from "src/transient/context.tsx";
import { AppInstallPromptListener } from "src/transient/install.tsx";
import { CreatePage } from "src/pages/CreatePage.tsx";
import { EditPage } from "src/pages/EditPage.tsx";
import { HistoryPage } from "src/pages/HistoryPage.tsx";
import { HistoryRecordPage } from "src/pages/history/HistoryRecordPage.tsx";
import { HomePage } from "src/pages/HomePage.tsx";
import { PlayPage } from "src/pages/PlayPage.tsx";
import { QrPage } from "src/pages/QrPage.tsx";
import { SettingsPage } from "src/pages/SettingsPage.tsx";
import { ImportPage } from "src/pages/ImportPage.tsx";
import {
  routeEditPreset,
  routeHistory,
  routeHistoryRecord,
  routeHistoryRecordEdit,
  routeHome,
  routeImportPreset,
  routeNewPreset,
  routePlayPreset,
  routeQrPreset,
  routeSettings,
} from "src/routes.ts";

import "src/App.css";
import "src/transitions.css";

export function App() {
  return (
    <ReactAudioContextProvider>
      <AppStateContextProvider>
        <TransientStateProvider>
          <AppStateLocalStorage />
          <AppInstallPromptListener />
          <Routes>
            <Route path={routeHome()} element={<HomePage />} />
            <Route path={routeNewPreset()} element={<CreatePage />} />
            <Route path={routeEditPreset(":presetId")} element={<EditPage />} />
            <Route path={routePlayPreset(":presetId")} element={<PlayPage />} />
            <Route path={routeQrPreset(":presetId")} element={<QrPage />} />
            <Route
              path={routeImportPreset(":content")}
              element={<ImportPage />}
            />
            <Route path={routeHistory()} element={<HistoryPage />} />
            <Route
              path={routeHistoryRecord(":recordId")}
              element={<HistoryRecordPage />}
            />
            <Route
              path={routeHistoryRecordEdit(":recordId")}
              element={<HistoryRecordPage editing />}
            />
            <Route path={routeSettings()} element={<SettingsPage />} />
          </Routes>
        </TransientStateProvider>
      </AppStateContextProvider>
    </ReactAudioContextProvider>
  );
}

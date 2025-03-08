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
            <Route path="/" element={<HomePage />} />
            <Route path="/new" element={<CreatePage />} />
            <Route path="/edit/:presetId" element={<EditPage />} />
            <Route path="/play/:presetId" element={<PlayPage />} />
            <Route path="/qr/:presetId" element={<QrPage />} />
            <Route path="/import/:content" element={<ImportPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route
              path="/history/record/:recordId"
              element={<HistoryRecordPage />}
            />
            <Route
              path="/history/record/:recordId/edit"
              element={<HistoryRecordPage editing />}
            />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </TransientStateProvider>
      </AppStateContextProvider>
    </ReactAudioContextProvider>
  );
}

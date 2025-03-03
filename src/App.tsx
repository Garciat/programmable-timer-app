import { Route, Routes } from "react-router";

import { ReactAudioContextProvider } from "./lib/audio/context.tsx";
import { AppStateContextProvider } from "./state/context.tsx";
import { AppStateLocalStorage } from "./storage/local.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { EditPage } from "./pages/EditPage.tsx";
import { CreatePage } from "./pages/CreatePage.tsx";
import { PlayPage } from "./pages/PlayPage.tsx";
import { SettingsPage } from "./pages/SettingsPage.tsx";
import { SharePage } from "./pages/SharePage.tsx";

import "./App.css";

export function App() {
  return (
    <ReactAudioContextProvider>
      <AppStateContextProvider>
        <AppStateLocalStorage />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<CreatePage />} />
          <Route path="/edit/:presetId" element={<EditPage />} />
          <Route path="/play/:presetId" element={<PlayPage />} />
          <Route path="/share/:content" element={<SharePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppStateContextProvider>
    </ReactAudioContextProvider>
  );
}

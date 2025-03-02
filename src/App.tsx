import { Route, Routes } from "react-router";

import {
  ReactAudioContext,
  unlockAudioContext,
} from "./lib/audio/ReactAudioContext.ts";
import { AppStateContextProvider } from "./state/context.tsx";
import { AppStateLocalStorage } from "./storage/local.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { EditPage } from "./pages/EditPage.tsx";
import { CreatePage } from "./pages/CreatePage.tsx";
import { PlayPage } from "./pages/PlayPage.tsx";
import { SharePage } from "./pages/SharePage.tsx";

import "./App.css";

export function App() {
  const audioContext = new AudioContext();
  unlockAudioContext(audioContext);

  return (
    <ReactAudioContext.Provider value={audioContext}>
      <AppStateContextProvider>
        <AppStateLocalStorage />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<CreatePage />} />
          <Route path="/edit/:presetId" element={<EditPage />} />
          <Route path="/play/:presetId" element={<PlayPage />} />
          <Route path="/share/:content" element={<SharePage />} />
        </Routes>
      </AppStateContextProvider>
    </ReactAudioContext.Provider>
  );
}

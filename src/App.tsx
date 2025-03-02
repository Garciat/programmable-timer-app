import { Route, Routes } from "react-router";

import {
  ReactAudioContext,
  unlockAudioContext,
} from "./lib/audio/ReactAudioContext.ts";
import { AppStateContextProvider } from "./state/context.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { EditPage } from "./pages/EditPage.tsx";
import { CreatePage } from "./pages/CreatePage.tsx";

import "./App.css";

export function App() {
  const audioContext = new AudioContext();
  unlockAudioContext(audioContext);

  return (
    <ReactAudioContext.Provider value={audioContext}>
      <AppStateContextProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<CreatePage />} />
          <Route path="/edit/:presetId" element={<EditPage />} />
        </Routes>
      </AppStateContextProvider>
    </ReactAudioContext.Provider>
  );
}

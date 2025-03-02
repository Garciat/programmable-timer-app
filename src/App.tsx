import { Route, Routes } from "react-router";

import {
  ReactAudioContext,
  unlockAudioContext,
} from "./lib/audio/ReactAudioContext.ts";
import { HomePage } from "./pages/HomePage.tsx";
import { EditPage } from "./pages/EditPage.tsx";

import "./App.css";

export function App() {
  const audioContext = new AudioContext();
  unlockAudioContext(audioContext);

  return (
    <ReactAudioContext.Provider value={audioContext}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/edit" element={<EditPage />} />
      </Routes>
    </ReactAudioContext.Provider>
  );
}

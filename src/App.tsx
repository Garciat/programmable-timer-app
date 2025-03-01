import { Route, Routes } from "react-router";

import { HomePage } from "./pages/HomePage.tsx";

import "./App.css";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

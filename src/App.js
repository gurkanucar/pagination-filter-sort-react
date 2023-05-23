import React from "react";
import { Routes, Route } from "react-router-dom";
import SearchPage from "./SearchPage";
import SearchPage2 from "./SearchPage2";

function App() {
  return (
    <>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search2" element={<SearchPage2 />} />
      </Routes>
    </>
  );
}

export default App;

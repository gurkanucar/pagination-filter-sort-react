import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import SearchPage from "./SearchPage";
import SearchPage2 from "./SearchPage2";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search2" element={<SearchPage2 />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

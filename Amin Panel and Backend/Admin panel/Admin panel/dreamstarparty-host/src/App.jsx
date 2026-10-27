import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SET_ADMIN } from "./store/admin/types";

import Admin from "./pages/Admin";
import HostHistory from "./pages/HostHistory";
import HostHistoryInfo from "./pages/HostHistoryInfo";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";

const STORAGE_KEY = "selectedLanguageCode";

function App() {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.admin);
  const token = localStorage.getItem("TOKEN");
  const key = localStorage.getItem("KEY");

  const params = new URLSearchParams(window.location.search);

  // ── Capture hostId (existing logic) ────────────────────────────────────────
  const hostId = params.get("id") || localStorage.getItem("hostId");
  localStorage.setItem("hostId", hostId);

  const urlLanguage = params.get("language")?.trim()?.toLowerCase();
  if (urlLanguage) {
    localStorage.setItem(STORAGE_KEY, urlLanguage);
  }

  useEffect(() => {
    if (!token && !key) return;
    dispatch({ type: SET_ADMIN, payload: token });
  }, [token, key, dispatch]);

  return (
    <div className="App">
      <LanguageSwitcher />
      <Suspense fallback={""}>
        <BrowserRouter>
          <Routes>
            <Route path="/host/homePage" element={<Admin />} />
            <Route path="/host/hosthistory" element={<HostHistory />} />
            <Route path="/host/historyInfo" element={<HostHistoryInfo />} />
            <Route path="*" element={<Navigate to="/host/homePage" />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;

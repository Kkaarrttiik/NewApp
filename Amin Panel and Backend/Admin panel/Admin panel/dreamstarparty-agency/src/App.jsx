import React, { Suspense, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SET_ADMIN } from "./store/admin/types";

import Admin from "./pages/Admin";
import TotalIncome from "./pages/TotalIncome";
import Creators from "./pages/Creators";
import HostHistory from "./pages/HostHistory";
import { AgencyRedeem } from "./pages/AgencyRedeem";
import HostRequest from "./pages/hostRequest/HostRequest";
import LanguageSwitcher from "./languageSwitcher/LanguageSwitcher";
import AgencyLayout from "./layouts/AgencyLayout";

const LANGUAGE_STORAGE_KEY = "selectedLanguageCode";

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("TOKEN");
  const key = localStorage.getItem("KEY");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token && !key) return;
    dispatch({ type: SET_ADMIN, payload: token });
  }, [token, key, dispatch]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    const language = queryParams.get("language")?.trim()?.toLowerCase();

    // ── Capture language from URL at login time and persist to localStorage ──
    // No hardcoded whitelist needed — reducer validates against active languages
    if (language) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }

    if (id) {
      localStorage.setItem("agencyId", id);
      navigate("/agencypanel/homePage", { replace: true });
    } else if (localStorage.getItem("agencyId")) {
      navigate("/agencypanel/homePage", { replace: true });
    }
  }, []);

  return (
    <div className="App">
      <LanguageSwitcher />
      <Suspense fallback={""}>
        <Routes>
          <Route path="/agencypanel" element={<AgencyLayout />}>
            <Route path="homePage" element={<Admin />} />
            <Route path="Income" element={<TotalIncome />} />
            <Route path="creators" element={<Creators />} />
            <Route path="creatorRequest" element={<HostRequest />} />
            <Route path="hosthistory" element={<HostHistory />} />
            <Route path="agencyredeem" element={<AgencyRedeem />} />
          </Route>
          <Route
            path="/"
            element={<Navigate to="/agencypanel/homePage" replace />}
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

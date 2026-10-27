import { Suspense, useEffect, useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
// Redux
import { useDispatch } from "react-redux";
// Types
import { SET_ADMIN, UNSET_ADMIN } from "./store/admin/types";

import { IdleTimeoutManager } from "idle-timer-manager";

// Components*-
import Admin from "./pages/Admin";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/LoginPage";
import Page404 from "./pages/Page404";
import Registration from "./pages/Registration";
import Spinner from "./pages/Spinner";
import UnlockScreenPage from "./pages/UnlockScreenPage";
import UpdateCode from "./pages/UpdateCode";
import AuthRouter from "./util/AuthRouter";
import { validateLoginData } from "./util/hash";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  const isAuth = sessionStorage.getItem("isAuth");
  const key = sessionStorage.getItem("KEY");
  const token = sessionStorage.getItem("TOKEN");
  const [login, setLogin] = useState(false);

  useEffect(() => {
    axios
      .get("/validateLogin")
      .then((res) => {
        setLogin(res.data.login);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const checkIntegrity = () => {
      if (!validateLoginData()) {
        dispatch({ type: UNSET_ADMIN });
        window.location.href = "/";
      }
    };

    checkIntegrity();

    window.addEventListener("storage", checkIntegrity);
    const interval = setInterval(checkIntegrity, 1000);

    return () => {
      window.removeEventListener("storage", checkIntegrity);
      clearInterval(interval);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!token && !key) return;
    dispatch({ type: SET_ADMIN, payload: token });
  }, [dispatch, token, key]);

  useEffect(() => {
    const manager = new IdleTimeoutManager({
      timeout: 1800, // 30 minutes
      onExpired: () => {
        dispatch({ type: UNSET_ADMIN });
        window.location.href = "/";
      },
    });

    return () => {
      manager.clear();
    };
  }, [dispatch]);

  return (
    <div className="App">
      <Suspense fallback={null}>
        <BrowserRouter>
          <Routes>
            {/* Login / Registration (same behavior) */}
            <Route path="/" element={login ? <Login /> : <Registration />} />
            <Route
              path="/login"
              element={login ? <Login /> : <Registration />}
            />
            {login === false && (
              <Route path="/registration" element={<Registration />} />
            )}

            {/* Public */}
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/changePassword/:id" element={<ChangePassword />} />
            <Route path="/unlock" element={<UnlockScreenPage />} />
            <Route path="/code" element={<UpdateCode />} />

            {/* Protected */}
            <Route element={<AuthRouter />}>
              <Route path="/admin/*" element={<Admin />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Page404 />} />
          </Routes>
          <Spinner />
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;

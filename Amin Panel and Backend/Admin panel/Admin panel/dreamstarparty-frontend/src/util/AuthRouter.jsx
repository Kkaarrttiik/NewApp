import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { validateLoginData } from "./hash";
import { UNSET_ADMIN } from "../store/admin/types";

const AuthRouter = () => {
  const dispatch = useDispatch();
  // Fetch auth state from Redux store
  const isAuth = useSelector((state) => state.admin?.isAuth);

  const isValid = validateLoginData();

  useEffect(() => {
    if (!isValid) {
      dispatch({ type: UNSET_ADMIN });
    }
  }, [isValid, dispatch]);

  if (!isAuth || !isValid) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AuthRouter;

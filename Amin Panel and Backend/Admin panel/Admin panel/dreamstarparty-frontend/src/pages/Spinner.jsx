import React from "react";
import { useSelector } from "react-redux";
import "../assets/css/custom.css";

const Spinner = () => {
  const open = useSelector((state) => state.spinner.networkProgressDialog);

  if (!open) return null;

  return (
    <div className="global-loader">
      <div className="loader-ring" />
    </div>
  );
};

export default React.memo(Spinner);

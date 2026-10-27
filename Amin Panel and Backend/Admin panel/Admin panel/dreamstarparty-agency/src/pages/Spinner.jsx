import React, { createRef } from "react";

import LottieModule from "lottie-react";
import animationData from "./Loader.json";

const Lottie = LottieModule.default ?? LottieModule;

// Redux
import { useSelector } from "react-redux";

//css
import "../assets/css/custom.css";

// MUI
import Dialog from "@mui/material/Dialog";

const Spinner = () => {
  const open = useSelector((state) => state.spinner.networkProgressDialog);
  const ref = createRef();
  return (
    <Dialog
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
      PaperComponent="div"
      PaperProps={{
        style: {
          background: "transparent",
          boxShadow: "none",
          border: "none",
          outline: "none",
        },
      }}
      ref={ref}
      sx={{
        "& .MuiDialog-paper": {
          background: "transparent",
          boxShadow: "none",
          border: "none",
          overflow: "visible",
        },
      }}
    >
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ height: 130, width: 130 }}
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
      />
    </Dialog>
  );
};

export default React.memo(Spinner);

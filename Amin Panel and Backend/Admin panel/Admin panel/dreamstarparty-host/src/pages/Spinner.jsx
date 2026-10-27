import React, { createRef } from "react";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import animationData from "./Loader.json";

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
      disableBackdropClick
      disableEscapeKeyDown
      PaperComponent="div"
      ref={ref}
      style={{
        background: "transparent",
        boxShadow: "none",
      }}
    >
      <DotLottieReact
        data={animationData}
        loop={true}
        autoplay={true}
        style={{ height: 130, width: 130 }}
      />
    </Dialog>
  );
};

export default React.memo(Spinner);

import { Box } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import React, { createElement, createRef, useRef } from "react";

const useQrCode = (obj, filename) => {
  const canvasRef = useRef();
  const buttonRef = createRef();

  const a = createElement("a", {
    download: `${filename}.png`,
    ref: buttonRef,
  });

  const qr = (
    <Box ref={canvasRef} sx={{ display: "none" }}>
      <QRCodeCanvas
        value={JSON.stringify(obj)}
        size={1000}
        includeMargin={true}
      />
    </Box>
  );

  const handleDownloadQr = () => {
    const dataURL = canvasRef.current.children[0].toDataURL("image/png");
    buttonRef.current.setAttribute("href", `${dataURL}`);
    buttonRef.current.click();
  };
  return { handleDownloadQr, qr, a };
};

export default useQrCode;

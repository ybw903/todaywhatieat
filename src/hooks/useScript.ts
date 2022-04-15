import { useEffect, useState } from "react";
import { apiKey } from "../apiKey";

const useScript = () => {
  useEffect(() => {
    if (window && document) {
      const script = document.createElement("script");
      script.type = "test/javascript";
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer,drawing`;
      script.async = true;
      script.onload = () => {
        console.log("hi");
      };
      document.body.appendChild(script);
    }
  }, []);
};

export default useScript;

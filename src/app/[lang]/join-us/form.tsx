"use client";

import { useEffect, useState } from "react";
import { md } from "../../../components/utils";

export default function Form() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  // TODO: do something with those magical numbers. Iframe should be well positioned automatically! Without this magic
  const iframeHeight = width > md ? 1696 : 2280;

  return (
    <iframe
      src="https://docs.google.com/forms/d/e/1FAIpQLSclnC3o9gft51GR9_lNdFoLY79DhKrdw-rR9JtGQ3bbwFltuw/viewform?embedded=true"
      width="100%"
      height={iframeHeight}
      frameBorder="0"
      marginHeight={0}
      marginWidth={0}
    >
      Loading…
    </iframe>
  );
}

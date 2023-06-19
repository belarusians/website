import React from "react";

export const Favicon = (): React.JSX.Element => {
  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      <link rel="manifest" href="/browserconfig.xml" />
      <link rel="mask-icon" type="image/svg+xml" href="/icons/safari-pinned-tab.svg" color="#ed1c24" />
    </>
  );
};

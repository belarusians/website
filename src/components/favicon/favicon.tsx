import React from "react";

export const Favicon = (): JSX.Element => {
  return (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="manifest" href="/browserconfig.xml" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#ed1c24" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="msapplication-TileColor" content="#b91d47" />
      <meta name="theme-color" content="#ffffff" />
    </>
  );
};

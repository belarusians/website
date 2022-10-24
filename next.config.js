const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");
const { i18n } = require("./next-i18next.config");

const withVanillaExtract = createVanillaExtractPlugin();
const withPWA = require("next-pwa")({
  dest: "public",
  disable: true,
});

const nextConfig = {
  i18n,
  reactStrictMode: true,
};

module.exports = withPWA(withVanillaExtract(nextConfig));

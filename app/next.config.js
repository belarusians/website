const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");
const { i18n } = require('./next-i18next.config');
const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig = {
  i18n
};

module.exports = withVanillaExtract(nextConfig);

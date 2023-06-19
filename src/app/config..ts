export const baseUrl = {
  production: new URL("https://www.belarusians.nl"),
  development: new URL(`https://${process.env.VERCEL_URL ?? "localhost:3000"}`),
  test: new URL(`https://${process.env.VERCEL_URL}`),
  local: new URL("http://localhost:3000"),
}[process.env.NODE_ENV];

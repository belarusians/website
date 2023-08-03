const nextJest = require("next/jest.js");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = createJestConfig({
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./src",
});

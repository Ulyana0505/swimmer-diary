const esModules = ["nanoid"].join("|");

/** @type {import("jest").Config} */
const config = {
  verbose: true,
  //testEnvironment: "jsdom",
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "\\.svg": "<rootDir>/jest.mock-svg.js",
    "^.+\\.(css|less|scss|png)$": "identity-obj-proxy",
    "^nanoid(/(.*)|$)": "nanoid$1"
  },
  transform: {
    "\\.[jt]sx?$": "babel-jest"
  },
  setupFilesAfterEnv: ["./jest.jsdom.cjs"],
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*"],
  clearMocks: true,
  globals: {
    window: {},
    jest: true
  },
  roots: ["tests"]
};

module.exports = config;

const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  preset: "ts-jest",
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        isolatedModules: true,
      },
    ],
  },
  testPathIgnorePatterns: ["dist"],
  rootDir: "./",
  testRegex: ".*\\.spec\\.ts$",
  testEnvironment: "node",
  setupFiles: ["./jest-setup.file.ts"],
};

export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+/serialize-error/.+\\.js$": [
      "ts-jest",
      { tsconfig: "<rootDir>/src/tsconfig.json" },
    ],
    "^.+/serialize-error/.+\\.ts$": [
      "ts-jest",
      { tsconfig: "<rootDir>/src/tsconfig.json" },
    ],
  },
  moduleNameMapper: {
    ".+\\.(png|jpg|jpeg|svg)$": "jest-transform-stub",
    "^@/mocks/(.*)$": "<rootDir>/__mocks__/$1",
    "^@/firebase/(.*)$": "<rootDir>/src/firebase/$1",
    "^@/icons/(.*)$": "<rootDir>/src/components/icons/$1",
    "^@/services/(.*)$": "<rootDir>/src/redux/services/$1",
    "^@/slices/(.*)$": "<rootDir>/src/redux/slices/$1",
    "^@/ui/(.*)$": "<rootDir>/src/components/ui/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transformIgnorePatterns: ["node_modules/(?!(serialize-error)/)"],

  collectCoverageFrom: ["!<rootDir>/src/components/ui/"],
};

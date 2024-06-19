export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    ".+\\.(png|jpg|jpeg|svg)$": "jest-transform-stub",
    "^@/mocks/(.*)$": "<rootDir>/__mocks__/$1",
    "^@/services/(.*)$": "<rootDir>/src/redux/services/$1",
    "^@/slices/(.*)$": "<rootDir>/src/redux/slices/$1",
    "^@/ui/(.*)$": "<rootDir>/src/components/ui/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

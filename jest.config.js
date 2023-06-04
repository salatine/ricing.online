/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.hbs$": "<rootDir>/textTransformer.js",
  }
};
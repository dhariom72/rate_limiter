module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: [
        '**/tests/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
  };
import { defineConfig } from 'cypress'

export default defineConfig({
  fileServerFolder: 'src/main/test/cypress',
  fixturesFolder: 'src/main/test/cypress/fixtures',
  screenshotsFolder: 'src/main/test/cypress/screenshots',
  downloadsFolder: 'src/main/test/cypress/downloads',

  e2e: {
    video: false,
    specPattern: 'src/main/test/cypress/**/**/*.spec.{js,jsx,ts,tsx}',
    supportFile: 'src/main/test/cypress/support',
    fileServerFolder: 'src/main/test/cypress',
    baseUrl: 'http://localhost:8080'
  }
})

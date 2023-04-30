import { defineConfig } from 'cypress'

export default defineConfig({
  fileServerFolder: 'src/main/test/cypress',
  fixturesFolder: 'src/main/test/cypres/fixtures',
  screenshotsFolder: 'src/main/test/cypres/screenshots',
  videosFolder: 'src/main/test/cypres/videos',
  downloadsFolder: 'src/main/test/cypres/downloads',

  e2e: {
    specPattern: 'src/main/test/cypress/**/**/*.spec.{js,jsx,ts,tsx}',
    supportFile: 'src/main/test/cypress/support',
    fileServerFolder: 'src/main/test/cypress',
    baseUrl: 'http://localhost:8080'
  }
})

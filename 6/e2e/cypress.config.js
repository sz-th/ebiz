import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 8000,
    viewportWidth: 1280,
    viewportHeight: 800,
    setupNodeEvents() {},
  },
})

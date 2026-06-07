import { defineConfig } from 'cypress'

const baseUrl = process.env.CYPRESS_BASE_URL || process.env.DEPLOY_URL || 'http://localhost:5173'

export default defineConfig({
  e2e: {
    baseUrl,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 800,
    setupNodeEvents() {},
  },
})

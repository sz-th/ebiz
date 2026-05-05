describe('06 - Przekierowanie z nieznanej ścieżki', () => {
  it('nieznana ścieżka prowadzi do "/"', () => {
    cy.stubProducts()
    cy.visit('/nieistnieje', { failOnStatusCode: false })
    cy.location('pathname').should('eq', '/')
  })
})

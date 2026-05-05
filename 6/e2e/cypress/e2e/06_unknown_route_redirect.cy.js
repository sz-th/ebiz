describe('06 - Przekierowanie z nieznanej ścieżki', () => {
  beforeEach(() => {
    cy.stubProducts()
  })

  it('nieznana ścieżka prowadzi do "/"', () => {
    cy.visit('/nieistnieje', { failOnStatusCode: false })
    cy.location('pathname').should('eq', '/')
    cy.get('.product-list li').should('have.length', 5)
  })

  it('inna nieznana ścieżka również prowadzi do "/"', () => {
    cy.visit('/cos/dziwnego', { failOnStatusCode: false })
    cy.location('pathname').should('eq', '/')
  })
})

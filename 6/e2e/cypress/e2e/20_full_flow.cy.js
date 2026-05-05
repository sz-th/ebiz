describe('20 - Pełny scenariusz zakupu', () => {
  it('produkty -> koszyk -> płatność -> czyszczenie -> powrót na produkty', () => {
    cy.stubProducts()
    cy.stubPaymentOk()
    cy.visit('/')
    cy.wait('@getProducts')

    cy.addProductToCart('Monitor 27 cali')
    cy.addProductToCart('Słuchawki nauszne')

    cy.get('.nav a').contains('Koszyk').click()
    cy.get('.product-list li').should('have.length', 2)

    cy.contains('button', 'Przejdź do płatności').click()
    cy.location('pathname').should('eq', '/payments')

    cy.get('input[type="text"]').type('Test User')
    cy.contains('button', 'Zapłać').click()
    cy.wait('@postPayment')

    cy.get('.status.ok').should('be.visible')
    cy.location('pathname', { timeout: 4000 }).should('eq', '/')
  })
})

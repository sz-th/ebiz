describe('20 - Pełny scenariusz zakupu', () => {
  it('produkty -> koszyk -> płatność -> czyszczenie -> powrót na produkty', () => {
    cy.stubProducts()
    cy.stubPaymentOk()
    cy.visit('/')
    cy.wait('@getProducts')

    cy.get('.product-list li').should('have.length', 5)
    cy.addProductToCart('Monitor 27 cali')
    cy.addProductToCart('Słuchawki nauszne')
    cy.get('.nav a').contains('Koszyk').should('contain.text', '(2)')

    cy.get('.nav a').contains('Koszyk').click()
    cy.get('.product-list li').should('have.length', 2)
    cy.get('.total').should('have.text', 'Suma: 1758.00 zł')

    cy.contains('button', 'Przejdź do płatności').click()
    cy.location('pathname').should('eq', '/payments')
    cy.get('input[type="number"]').should('have.value', '1758.00')

    cy.get('input[type="text"]').type('Test User')
    cy.contains('button', 'Zapłać').click()
    cy.wait('@postPayment')

    cy.get('.status.ok').should('be.visible')
    cy.get('.status.ok').should('contain.text', '1758.00')
    cy.location('pathname', { timeout: 4000 }).should('eq', '/')
    cy.get('.nav a').contains('Koszyk').should('contain.text', '(0)')
  })
})

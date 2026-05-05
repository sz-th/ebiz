describe('17 - Walidacja formularza (holder wymagany)', () => {
  it('nie wysyła płatności bez imienia i nazwiska', () => {
    cy.stubProducts()
    cy.stubPaymentOk()
    cy.visit('/payments')
    cy.get('input[type="number"]').clear().type('199.99')
    cy.contains('button', 'Zapłać').click()
    cy.get('input[type="text"]:invalid').should('exist')
  })
})

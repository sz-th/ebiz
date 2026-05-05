describe('15 - Formularz płatności', () => {
  it('renderuje pola formularza i przycisk', () => {
    cy.stubProducts()
    cy.visit('/payments')
    cy.get('form.payment-form select').should('exist')
    cy.get('form.payment-form input[type="text"]').should('exist')
    cy.get('form.payment-form input[type="number"]').should('exist')
    cy.get('form.payment-form button[type="submit"]').should('contain.text', 'Zapłać')
  })
})

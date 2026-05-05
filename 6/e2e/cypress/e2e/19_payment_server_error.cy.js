describe('19 - Błąd płatności po stronie serwera', () => {
  it('pokazuje status błędu z odpowiedzi backendu', () => {
    cy.stubProducts()
    cy.stubPaymentError('Kwota musi być większa od zera')
    cy.visit('/payments')
    cy.get('input[type="text"]').type('Anna Nowak')
    cy.get('input[type="number"]').clear().type('10')
    cy.contains('button', 'Zapłać').click()
    cy.wait('@postPayment')
    cy.get('.status.err').should('contain.text', 'Kwota musi być większa od zera')
  })
})

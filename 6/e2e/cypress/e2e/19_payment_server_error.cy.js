describe('19 - Błąd płatności po stronie serwera', () => {
  beforeEach(() => {
    cy.stubProducts()
  })

  it('pokazuje status błędu z odpowiedzi backendu', () => {
    cy.stubPaymentError('Kwota musi być większa od zera')
    cy.visit('/payments')
    cy.get('input[type="text"]').type('Anna Nowak')
    cy.get('input[type="number"]').clear().type('10')
    cy.contains('button', 'Zapłać').click()
    cy.wait('@postPayment')
    cy.get('.status.err').should('be.visible')
    cy.get('.status.err').should('contain.text', 'Kwota musi być większa od zera')
    cy.get('.status.ok').should('not.exist')
    cy.location('pathname').should('eq', '/payments')
  })

  it('pokazuje fallback gdy backend nie zwraca komunikatu', () => {
    cy.intercept('POST', '**/payments', { statusCode: 500, body: {} }).as('postPayment')
    cy.visit('/payments')
    cy.get('input[type="text"]').type('Test User')
    cy.get('input[type="number"]').clear().type('99.99')
    cy.contains('button', 'Zapłać').click()
    cy.wait('@postPayment')
    cy.get('.status.err').should('contain.text', 'Płatność odrzucona')
  })
})

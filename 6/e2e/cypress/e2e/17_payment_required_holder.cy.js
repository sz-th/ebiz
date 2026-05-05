describe('17 - Walidacja formularza (holder wymagany)', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.stubPaymentOk()
    cy.visit('/payments')
  })

  it('nie wysyła płatności bez imienia i nazwiska', () => {
    cy.get('input[type="text"]').should('have.value', '')
    cy.get('input[type="number"]').clear().type('199.99')
    cy.contains('button', 'Zapłać').click()
    cy.get('input[type="text"]:invalid').should('exist')
    cy.get('.status').should('not.exist')
    cy.location('pathname').should('eq', '/payments')
  })

  it('po wpisaniu nazwy formularz przechodzi walidację', () => {
    cy.get('input[type="text"]').type('Jan Testowy')
    cy.get('input[type="number"]').clear().type('199.99')
    cy.get('input[type="text"]:invalid').should('not.exist')
    cy.get('input[type="number"]:invalid').should('not.exist')
  })
})

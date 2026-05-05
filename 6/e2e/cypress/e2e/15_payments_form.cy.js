describe('15 - Formularz płatności', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/payments')
  })

  it('renderuje pola formularza i przycisk', () => {
    cy.get('form.payment-form').should('exist')
    cy.get('form.payment-form select').should('exist')
    cy.get('form.payment-form select option').should('have.length', 3)
    cy.get('form.payment-form input[type="text"]').should('exist').and('have.attr', 'required')
    cy.get('form.payment-form input[type="number"]').should('exist').and('have.attr', 'required')
    cy.get('form.payment-form input[type="number"]').should('have.attr', 'min', '0.01')
    cy.get('form.payment-form button[type="submit"]')
      .should('contain.text', 'Zapłać')
      .and('not.be.disabled')
  })

  it('select ma trzy metody płatności', () => {
    cy.get('form.payment-form select option').eq(0).should('have.value', 'card')
    cy.get('form.payment-form select option').eq(1).should('have.value', 'blik')
    cy.get('form.payment-form select option').eq(2).should('have.value', 'transfer')
  })
})

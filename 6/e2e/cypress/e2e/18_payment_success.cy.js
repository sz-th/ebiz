describe('18 - Pomyślna płatność', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.stubPaymentOk()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('wysyła płatność i pokazuje status OK', () => {
    cy.addProductToCart('Klawiatura mechaniczna')
    cy.get('.nav a').contains('Płatności').click()
    cy.get('input[type="text"]').type('Jan Kowalski')
    cy.contains('button', 'Zapłać').click()
    cy.wait('@postPayment')
    cy.get('.status.ok').should('contain.text', 'PMT-')
  })
})

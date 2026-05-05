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

    cy.wait('@postPayment').its('request.body').should((body) => {
      expect(body).to.have.property('method', 'card')
      expect(body).to.have.property('holder', 'Jan Kowalski')
      expect(body.amount).to.eq(349.99)
    })

    cy.get('.status.ok').should('be.visible')
    cy.get('.status.ok').should('contain.text', 'PMT-')
    cy.get('.status.ok').should('contain.text', '349.99')
  })

  it('po pomyślnej płatności koszyk jest pusty', () => {
    cy.addProductToCart('Mysz bezprzewodowa')
    cy.get('.nav a').contains('Płatności').click()
    cy.get('input[type="text"]').type('Anna Nowak')
    cy.contains('button', 'Zapłać').click()
    cy.wait('@postPayment')

    cy.get('.status.ok').should('be.visible')
    cy.location('pathname', { timeout: 4000 }).should('eq', '/')
    cy.get('.nav a').contains('Koszyk').should('contain.text', '(0)')
  })
})

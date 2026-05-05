describe('08 - Dodanie produktu do koszyka', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('po dodaniu produkt pojawia się w koszyku', () => {
    cy.addProductToCart('Klawiatura mechaniczna')
    cy.get('.nav a').contains('Koszyk').click()
    cy.contains('Klawiatura mechaniczna').should('be.visible')
  })
})

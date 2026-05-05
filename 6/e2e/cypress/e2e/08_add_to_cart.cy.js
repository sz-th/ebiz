describe('08 - Dodanie produktu do koszyka', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('po dodaniu produkt pojawia się w koszyku', () => {
    cy.addProductToCart('Klawiatura mechaniczna')
    cy.get('.nav a').contains('Koszyk').click()
    cy.get('.product-list li').should('have.length', 1)
    cy.contains('.product-list li', 'Klawiatura mechaniczna').should('be.visible')
    cy.contains('.product-list li', 'Klawiatura mechaniczna').should('contain.text', '× 1')
    cy.contains('.product-list li', 'Klawiatura mechaniczna')
      .find('.price')
      .should('have.text', '349.99 zł')
  })
})

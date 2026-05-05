describe('11 - Suma w koszyku (1 produkt)', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('pokazuje sumę równą cenie produktu', () => {
    cy.addProductToCart('Klawiatura mechaniczna')
    cy.get('.nav a').contains('Koszyk').click()
    cy.get('.product-list li').should('have.length', 1)
    cy.get('.total').should('have.text', 'Suma: 349.99 zł')
    cy.contains('.product-list li', 'Klawiatura mechaniczna').should('contain.text', '× 1')
  })
})

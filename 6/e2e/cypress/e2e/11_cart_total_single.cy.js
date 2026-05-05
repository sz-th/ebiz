describe('11 - Suma w koszyku (1 produkt)', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('pokazuje sumę równą cenie produktu', () => {
    cy.addProductToCart('Klawiatura mechaniczna')
    cy.get('.nav a').contains('Koszyk').click()
    cy.get('.total').should('contain.text', '349.99 zł')
  })
})

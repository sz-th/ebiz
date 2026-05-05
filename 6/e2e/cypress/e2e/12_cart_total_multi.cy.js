describe('12 - Suma w koszyku (wiele produktów)', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('sumuje ceny wielu różnych produktów', () => {
    cy.addProductToCart('Mysz bezprzewodowa')
    cy.addProductToCart('Słuchawki nauszne')
    cy.get('.nav a').contains('Koszyk').click()
    cy.get('.product-list li').should('have.length', 2)
    cy.get('.total').should('have.text', 'Suma: 388.50 zł')
  })

  it('sumuje ceny przy mieszanej liczbie sztuk', () => {
    cy.addProductToCart('Podkładka pod mysz')
    cy.addProductToCart('Podkładka pod mysz')
    cy.addProductToCart('Mysz bezprzewodowa')
    cy.get('.nav a').contains('Koszyk').click()
    cy.get('.product-list li').should('have.length', 2)
    cy.get('.total').should('have.text', 'Suma: 229.48 zł')
  })
})

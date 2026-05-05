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
    cy.get('.total').should('contain.text', '388.50 zł')
  })
})

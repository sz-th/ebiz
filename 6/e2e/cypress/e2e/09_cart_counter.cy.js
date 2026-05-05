describe('09 - Licznik koszyka w pasku', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('licznik koszyka rośnie po dodaniu różnych produktów', () => {
    cy.get('.nav a').contains('Koszyk').should('contain.text', '(0)')
    cy.addProductToCart('Mysz bezprzewodowa')
    cy.get('.nav a').contains('Koszyk').should('contain.text', '(1)')
    cy.addProductToCart('Monitor 27 cali')
    cy.get('.nav a').contains('Koszyk').should('contain.text', '(2)')
    cy.addProductToCart('Słuchawki nauszne')
    cy.get('.nav a').contains('Koszyk').should('contain.text', '(3)')
  })

  it('dodanie tego samego produktu nie zwiększa liczby pozycji', () => {
    cy.get('.nav a').contains('Koszyk').should('contain.text', '(0)')
    cy.addProductToCart('Mysz bezprzewodowa')
    cy.addProductToCart('Mysz bezprzewodowa')
    cy.get('.nav a').contains('Koszyk').should('contain.text', '(1)')
  })
})

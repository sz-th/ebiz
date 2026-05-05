describe('10 - Wielokrotne dodawanie tego samego produktu', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('zwiększa qty zamiast tworzyć duplikaty', () => {
    cy.addProductToCart('Podkładka pod mysz')
    cy.addProductToCart('Podkładka pod mysz')
    cy.addProductToCart('Podkładka pod mysz')
    cy.get('.nav a').contains('Koszyk').click()
    cy.get('.product-list li').should('have.length', 1)
    cy.contains('.product-list li', 'Podkładka pod mysz').should('contain.text', '× 3')
    cy.contains('.product-list li', 'Podkładka pod mysz')
      .find('.price')
      .should('have.text', '149.97 zł')
    cy.get('.total').should('contain.text', '149.97 zł')
  })
})

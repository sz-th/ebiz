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
    cy.contains('.product-list li', 'Podkładka pod mysz').should('contain.text', '× 3')
  })
})

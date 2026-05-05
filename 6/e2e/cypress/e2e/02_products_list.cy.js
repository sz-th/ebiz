describe('02 - Lista produktów', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('wyświetla wszystkie produkty z backendu', () => {
    cy.get('.product-list li').should('have.length', 5)
  })
})

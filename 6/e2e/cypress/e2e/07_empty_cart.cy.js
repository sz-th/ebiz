describe('07 - Pusty koszyk', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/cart')
  })

  it('po wejściu na /cart pokazuje informację o pustym koszyku', () => {
    cy.contains('Koszyk jest pusty.').should('be.visible')
    cy.get('.section h2').should('have.text', 'Koszyk')
    cy.get('.product-list').should('not.exist')
    cy.contains('a', 'Wróć do produktów').should('have.attr', 'href', '/')
  })
})

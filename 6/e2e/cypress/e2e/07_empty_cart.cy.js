describe('07 - Pusty koszyk', () => {
  it('po wejściu na /cart pokazuje informację o pustym koszyku', () => {
    cy.stubProducts()
    cy.visit('/cart')
    cy.contains('Koszyk jest pusty.').should('be.visible')
  })
})

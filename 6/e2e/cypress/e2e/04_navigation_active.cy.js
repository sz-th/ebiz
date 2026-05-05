describe('04 - Aktywny link nawigacji', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
  })

  it('po wejściu na "/" link Produkty ma klasę active', () => {
    cy.get('.nav a').contains('Produkty').should('have.class', 'active')
  })
})

describe('04 - Aktywny link nawigacji', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
  })

  it('po wejściu na "/" link Produkty ma klasę active', () => {
    cy.get('.nav a').contains('Produkty').should('have.class', 'active')
    cy.get('.nav a').contains('Koszyk').should('not.have.class', 'active')
    cy.get('.nav a').contains('Płatności').should('not.have.class', 'active')
    cy.get('.nav a.active').should('have.length', 1)
  })
})

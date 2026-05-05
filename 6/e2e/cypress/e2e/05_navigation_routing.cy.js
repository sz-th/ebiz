describe('05 - Routing między widokami', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
  })

  it('przechodzi do koszyka i płatności', () => {
    cy.get('.nav a').contains('Koszyk').click()
    cy.location('pathname').should('eq', '/cart')

    cy.get('.nav a').contains('Płatności').click()
    cy.location('pathname').should('eq', '/payments')
  })
})

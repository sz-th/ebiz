describe('05 - Routing między widokami', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
  })

  it('przechodzi do koszyka i płatności i aktualizuje aktywny link', () => {
    cy.get('.nav a').contains('Koszyk').click()
    cy.location('pathname').should('eq', '/cart')
    cy.get('.nav a.active').should('contain.text', 'Koszyk')

    cy.get('.nav a').contains('Płatności').click()
    cy.location('pathname').should('eq', '/payments')
    cy.get('.nav a.active').should('contain.text', 'Płatności')

    cy.get('.nav a').contains('Produkty').click()
    cy.location('pathname').should('eq', '/')
    cy.get('.nav a.active').should('contain.text', 'Produkty')
  })
})

describe('01 - Topbar', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
  })

  it('wyświetla nagłówek aplikacji', () => {
    cy.get('.topbar').should('exist').and('be.visible')
    cy.get('.topbar h1').should('have.text', 'Sklep eBiz').and('not.be.empty')
    cy.get('.nav').should('exist')
    cy.get('.nav a').should('have.length', 3)
  })
})

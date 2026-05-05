describe('01 - Topbar', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
  })

  it('wyświetla nagłówek aplikacji', () => {
    cy.get('.topbar h1').should('have.text', 'Sklep eBiz')
  })
})

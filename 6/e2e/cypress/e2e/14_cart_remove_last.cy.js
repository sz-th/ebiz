describe('14 - Usunięcie ostatniego elementu', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('koszyk wraca do stanu pustego', () => {
    cy.addProductToCart('Słuchawki nauszne')
    cy.get('.nav a').contains('Koszyk').click()
    cy.contains('button', 'Usuń').click()
    cy.contains('Koszyk jest pusty.').should('be.visible')
  })
})

describe('14 - Usunięcie ostatniego elementu', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('koszyk wraca do stanu pustego', () => {
    cy.addProductToCart('Słuchawki nauszne')
    cy.get('.nav a').contains('Koszyk').click()
    cy.get('.product-list li').should('have.length', 1)

    cy.contains('button', 'Usuń').click()

    cy.contains('Koszyk jest pusty.').should('be.visible')
    cy.get('.product-list').should('not.exist')
    cy.contains('a', 'Wróć do produktów').should('be.visible')
    cy.get('.nav a').contains('Koszyk').should('contain.text', '(0)')
  })
})

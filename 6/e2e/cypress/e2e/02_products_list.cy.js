describe('02 - Lista produktów', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('wyświetla wszystkie produkty z backendu', () => {
    cy.get('.product-list li').should('have.length', 5)
    cy.contains('.product-list li', 'Klawiatura mechaniczna').should('be.visible')
    cy.contains('.product-list li', 'Mysz bezprzewodowa').should('be.visible')
    cy.contains('.product-list li', 'Monitor 27 cali').should('be.visible')
    cy.contains('.product-list li', 'Słuchawki nauszne').should('be.visible')
    cy.contains('.product-list li', 'Podkładka pod mysz').should('be.visible')
    cy.get('.product-list li button').should('have.length', 5)
  })
})

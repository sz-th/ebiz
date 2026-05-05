describe('13 - Usuwanie z koszyka', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('usuwa pozycję po kliknięciu Usuń', () => {
    cy.addProductToCart('Mysz bezprzewodowa')
    cy.addProductToCart('Klawiatura mechaniczna')
    cy.get('.nav a').contains('Koszyk').click()

    cy.contains('.product-list li', 'Mysz bezprzewodowa').within(() => {
      cy.contains('button', 'Usuń').click()
    })

    cy.contains('.product-list li', 'Mysz bezprzewodowa').should('not.exist')
  })
})

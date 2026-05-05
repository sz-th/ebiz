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
    cy.get('.product-list li').should('have.length', 2)

    cy.contains('.product-list li', 'Mysz bezprzewodowa').within(() => {
      cy.contains('button', 'Usuń').click()
    })

    cy.contains('.product-list li', 'Mysz bezprzewodowa').should('not.exist')
    cy.get('.product-list li').should('have.length', 1)
    cy.contains('.product-list li', 'Klawiatura mechaniczna').should('be.visible')
    cy.get('.total').should('have.text', 'Suma: 349.99 zł')
    cy.get('.nav a').contains('Koszyk').should('contain.text', '(1)')
  })
})

describe('03 - Format cen produktów', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('każda cena jest w formacie "X.XX zł"', () => {
    cy.get('.product-list li .price').should('have.length', 5)
    cy.get('.product-list li .price').each(($el) => {
      expect($el.text()).to.match(/^\d+\.\d{2} zł$/)
    })
    cy.contains('.product-list li', 'Klawiatura mechaniczna')
      .find('.price')
      .should('have.text', '349.99 zł')
    cy.contains('.product-list li', 'Podkładka pod mysz')
      .find('.price')
      .should('have.text', '49.99 zł')
  })
})

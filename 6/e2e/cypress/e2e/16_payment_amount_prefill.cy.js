describe('16 - Kwota płatności prefill z koszyka', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('formularz uzupełnia kwotę sumą koszyka', () => {
    cy.addProductToCart('Monitor 27 cali')
    cy.get('.nav a').contains('Płatności').click()
    cy.get('input[type="number"]').should('have.value', '1499.00')
  })
})

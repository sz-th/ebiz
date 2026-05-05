describe('03 - Format cen produktów', () => {
  beforeEach(() => {
    cy.stubProducts()
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('każda cena jest w formacie "X.XX zł"', () => {
    cy.get('.product-list li .price').each(($el) => {
      expect($el.text()).to.match(/^\d+\.\d{2} zł$/)
    })
  })
})

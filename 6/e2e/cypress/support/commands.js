Cypress.Commands.add('stubProducts', (overrides) => {
  const products = overrides || [
    { id: 1, name: 'Klawiatura mechaniczna', price: 349.99 },
    { id: 2, name: 'Mysz bezprzewodowa', price: 129.50 },
    { id: 3, name: 'Monitor 27 cali', price: 1499.00 },
    { id: 4, name: 'Słuchawki nauszne', price: 259.00 },
    { id: 5, name: 'Podkładka pod mysz', price: 49.99 },
  ]
  cy.intercept('GET', '**/products', {
    statusCode: 200,
    body: products,
  }).as('getProducts')
})

Cypress.Commands.add('stubPaymentOk', () => {
  cy.intercept('POST', '**/payments', (req) => {
    req.reply({
      statusCode: 201,
      body: {
        id: 'PMT-20260101120000',
        status: 'OK',
        amount: req.body.amount,
        method: req.body.method,
        timestamp: new Date().toISOString(),
      },
    })
  }).as('postPayment')
})

Cypress.Commands.add('stubPaymentError', (msg) => {
  cy.intercept('POST', '**/payments', {
    statusCode: 400,
    body: { error: msg || 'Kwota musi być większa od zera' },
  }).as('postPayment')
})

Cypress.Commands.add('addProductToCart', (productName) => {
  cy.contains('.product-list li', productName).within(() => {
    cy.contains('button', 'Dodaj do koszyka').click()
  })
})

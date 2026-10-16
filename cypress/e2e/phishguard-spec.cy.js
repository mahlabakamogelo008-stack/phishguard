describe('PhishGuard Tests', () => {
  it('Should detect a safe URL', () => {
    cy.visit('http://localhost:8080')
    cy.get('#urlInput').type('https://google.com')
    cy.get('#scanButton').click()
    cy.contains('LIKELY SAFE')
  })

  it('Should detect a suspicious URL', () => {
    cy.visit('http://localhost:8080')
    cy.get('#urlInput').type('http://verify-login.com')
    cy.get('#scanButton').click()
    cy.contains('SUSPICIOUS')
  })

  it('Should detect a phishing URL', () => {
    cy.visit('http://localhost:8080')
    cy.get('#urlInput').type('http://secure-verify.paypal-account.xyz')
    cy.get('#scanButton').click()
    cy.contains('LIKELY PHISHING')
  })

  it('Should show warning for IP address URL', () => {
    cy.visit('http://localhost:8080')
    cy.get('#urlInput').type('http://192.168.1.1/login')
    cy.get('#scanButton').click()
    cy.contains('IP address')
  })

  it('Should show error for empty URL', () => {
    cy.visit('http://localhost:8080')
    cy.get('#scanButton').click()
    cy.contains('Please enter a website URL.')
  })
})
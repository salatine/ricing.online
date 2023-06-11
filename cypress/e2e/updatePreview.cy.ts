describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://localhost:8080/')
    cy.wait(75000) // FIXME load config
    emulator().compareSnapshot('default-rice', 0.1)
    cy.contains('Update preview').click()
    cy.wait(75000) // FIXME load config
    emulator().compareSnapshot('updated-rice', 0.1)
  })
  
  function emulator() {
    return cy.get('#screen_container')
  }
})
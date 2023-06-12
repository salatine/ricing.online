describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://localhost:8080/')
    
    // Loading should show up, and then disappear
    loading().should('exist')
    loading().should('not.exist')
    compareEmulatorScreenshot('default-rice')

    cy.contains('Update preview').click()

    loading().should('not.exist')
    compareEmulatorScreenshot('updated-rice')
  })

  function compareEmulatorScreenshot(name: string, threshold: number = 0.1, tolerancyTime: number = 15000): void {
    cy.wait(tolerancyTime)
    emulator().compareSnapshot(name, threshold)
  }

  function emulator() {
    return cy.get('#screen_container')
  }
  
  function loading(timeout: number = 100000) {
    return cy.get("[data-testid='loading']", { timeout })
  }
})

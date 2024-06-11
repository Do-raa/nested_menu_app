
describe('NestedList Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should display the input field and add button', () => {
    cy.get('.input-container input').should('exist');
    cy.get('.input-container button').should('exist');
  });

  it('should add a new item to the list', () => {
    cy.get('.input-container input').type('New Item{enter}');
    cy.get('.list-container .item').should('contain', 'New Item');
  });

  it('should edit an existing item', () => {
    cy.get('.input-container input').type('Edit Me{enter}');
    cy.get('.list-container .item span').first().click();
    cy.get('.list-container .item input')
      .clear()
      .type('Edited Item{enter}');
    cy.get('.list-container .item').should('contain', 'Edited Item');
  });

  it('should add a child item', () => {
    cy.get('.input-container input').type('Parent Item{enter}');
    cy.get('.list-container .item button').first().click();
    cy.get('.child-input-container input')
      .type('Child Item{enter}');
    cy.get('.list-container .children .item').should('contain', 'Child Item');
  });

  it('should cancel adding a child item on click outside', () => {
    cy.get('.input-container input').type('Parent Item{enter}');
    cy.get('.list-container .item button').first().click();
    cy.get('body').click(0, 0); // Click outside the input
    cy.get('.child-input-container input').should('not.exist');
  });

  it('should capitalize the first letter of the input value', () => {
    cy.get('.input-container input').type('lowercase item{enter}');
    cy.get('.list-container .item').should('contain', 'Lowercase item');
  });
});

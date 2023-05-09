import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /surveys/i
const mockUnexpectedError = (): void => {
  Http.mockServerError(path, 'GET')
}
const mockAccessDeniedError = (): void => {
  Http.mockUnauthorizedError(path, 'GET')
}
const mockSuccess = (): void => {
  Http.mockOk(path, 'GET', 'survey-list')
}

describe('SurveyList', () => {
  beforeEach(() => {
    cy.fixture('account').then((account) => {
      Helper.setLocalStorageItem('account', account)
    })
    cy.visit('')
  })

  it('Should present error on UnexpectedError', () => {
    mockUnexpectedError()
    cy.findByTestId('error-wrap').should(
      'contain.text',
      'Algo de errado aconteceu. Tente novamente em breve'
    )
  })

  it('Should reload ob button click', () => {
    mockUnexpectedError()
    cy.findByTestId('error-wrap').should(
      'contain.text',
      'Algo de errado aconteceu. Tente novamente em breve'
    )
    mockSuccess()
    cy.findByRole('button', { name: /tentar novamente/i }).click()
    cy.findAllByRole('listitem', { name: /survey$/i }).should('have.length', 2)
  })

  it('Should present error on UnexpectedError', () => {
    mockAccessDeniedError()
    Helper.testUrl('/login')
  })

  it('Should present correct username', () => {
    mockUnexpectedError()
    const { name } = Helper.getLocalStorageItem('account')
    cy.getByLabel('username').should('contain.text', name)
  })

  it('Should logout on logout link click', () => {
    mockUnexpectedError()
    cy.findByRole('link', { name: /sair/i }).click()
    Helper.testUrl('/login')
  })

  it('Should present survey items', () => {
    mockSuccess()
    cy.findAllByRole('listitem', { name: /survey-empty$/i }).should(
      'have.length',
      4
    )
    cy.findAllByRole('listitem', { name: /survey$/i }).should('have.length', 2)
    cy.get('li:nth-child(1)').then((li) => {
      assert.equal(li.find('[data-testid="day"]').text(), '03')
      assert.equal(li.find('[data-testid="month"]').text(), 'fev')
      assert.equal(li.find('[data-testid="year"]').text(), '2018')
      assert.equal(li.find('[role="paragraph"]').text(), 'Question 1')
      assert.equal(li.find('[role="icon"]').attr('data-icon-name'), 'thumbUp')
    })
    cy.get('li:nth-child(2)').then((li) => {
      assert.equal(li.find('[data-testid="day"]').text(), '08')
      assert.equal(li.find('[data-testid="month"]').text(), 'mai')
      assert.equal(li.find('[data-testid="year"]').text(), '2020')
      assert.equal(li.find('[role="paragraph"]').text(), 'Question 2')
      assert.equal(li.find('[role="icon"]').attr('data-icon-name'), 'thumbDown')
    })
  })
})

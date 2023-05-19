import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /api\/surveys/i
const mockLoadSuccess = (): void => {
  Http.mockOk(path, 'GET', 'survey-result')
}

describe('SurveyResult', () => {
  describe('load', () => {
    const mockUnexpectedError = (): void => {
      Http.mockServerError(path, 'GET')
    }
    const mockAccessDeniedError = (): void => {
      Http.mockUnauthorizedError(path, 'GET')
    }

    beforeEach(() => {
      cy.fixture('account').then((account) => {
        Helper.setLocalStorageItem('account', account)
      })
      cy.visit('/surveys/any_id')
    })

    it('Should present error on UnexpectedError', () => {
      mockUnexpectedError()
      cy.findByTestId('error-wrap').should(
        'contain.text',
        'Algo de errado aconteceu. Tente novamente em breve'
      )
    })

    it('Should reload on button click', () => {
      mockUnexpectedError()
      cy.findByTestId('error-wrap').should(
        'contain.text',
        'Algo de errado aconteceu. Tente novamente em breve'
      )
      mockLoadSuccess()
      cy.findByRole('button', { name: /tentar novamente/i }).click()
      cy.findByTestId('survey-result').should('exist')
    })

    it('Should present error on AccessDeniedError', () => {
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

    it('Should present survey result', () => {
      mockLoadSuccess()
      cy.findAllByRole('listitem').should('have.length', 2)
      cy.get('[data-testid=survey-header]').then((header) => {
        assert.equal(header.find('[data-testid="day"]').text(), '03')
        assert.equal(header.find('[data-testid="month"]').text(), 'fev')
        assert.equal(header.find('[data-testid="year"]').text(), '2018')
        assert.equal(header.find('h2').text(), 'Question 1')
      })
      cy.get('li:nth-child(1)').then((li) => {
        assert.equal(li.find('[data-testid="answer"]').text(), 'Answer 1')
        assert.equal(li.find('[data-testid="percent"]').text(), '30%')
        assert.notExists(li.find('img'))
      })
      cy.get('li:nth-child(2)').then((li) => {
        assert.equal(li.find('[data-testid="answer"]').text(), 'Answer 2')
        assert.include(li.attr('class'), 'active')
        assert.equal(li.find('[data-testid="percent"]').text(), '70%')
        assert.exists(li.find('img'))
      })
    })

    it('Should go to surveys list on click go back', () => {
      mockLoadSuccess()
      cy.visit('')
      cy.visit('/surveys/any_id')
      cy.findByRole('button', { name: /voltar/i }).click()
      Helper.testUrl('/')
    })
  })

  describe.only('save', () => {
    const savePath = /api\/votes/i
    const mockUnexpectedError = (): void => {
      Http.mockServerError(savePath, 'PUT')
    }

    const mockAccessDeniedError = (): void => {
      Http.mockUnauthorizedError(savePath, 'PUT')
    }

    beforeEach(() => {
      cy.fixture('account').then((account) => {
        Helper.setLocalStorageItem('account', account)
      })
      mockLoadSuccess()
      cy.visit('/surveys/any_id')
    })

    it('Should present error on UnexpectedError', () => {
      mockUnexpectedError()
      cy.get('li:nth-child(1)').click()
      cy.findByTestId('error-wrap').should(
        'contain.text',
        'Algo de errado aconteceu. Tente novamente em breve'
      )
    })

    it('Should present error on AccessDeniedError', () => {
      mockAccessDeniedError()
      cy.get('li:nth-child(1)').click()
      Helper.testUrl('/login')
    })
  })
})

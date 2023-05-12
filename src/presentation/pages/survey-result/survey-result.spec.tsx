import React from 'react'
import { render, screen } from '@testing-library/react'
import { SurveyResult } from './survey-result'
import { mockAccountModel } from '@/domain/test'
import { ApiContext } from '@/presentation/contexts'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

const makeSut = (): void => {
  const history = createMemoryRouter(
    [
      { path: '/surveys', element: <SurveyResult /> },
      { path: '/', element: <></> }
    ],
    {
      initialIndex: 0,
      initialEntries: ['/surveys']
    }
  )
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => mockAccountModel()
      }}
    >
      <RouterProvider router={history} />
    </ApiContext.Provider>
  )
}

describe('SurveyResult Component', () => {
  test('Should present correct initial state', async () => {
    makeSut()
    expect(screen.getByTestId('survey-result')).toBeEmptyDOMElement()
    expect(screen.queryByTestId('error-wrap')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading-wrap')).not.toBeInTheDocument()
  })
})

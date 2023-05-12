import React from 'react'
import { render, screen } from '@testing-library/react'
import { SurveyResult } from './survey-result'
import { LoadSurveyResultSpy, mockAccountModel } from '@/domain/test'
import { ApiContext } from '@/presentation/contexts'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const history = createMemoryRouter(
    [
      {
        path: '/surveys',
        element: <SurveyResult loadSurveyResult={loadSurveyResultSpy} />
      },
      { path: '/', element: <></> }
    ],
    {
      initialIndex: 0,
      initialEntries: ['/surveys']
    }
  )

  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: jest.fn(),
        getCurrentAccount: () => mockAccountModel()
      }}
    >
      <RouterProvider router={history} />
    </ApiContext.Provider>
  )

  return { loadSurveyResultSpy }
}

describe('SurveyResult Component', () => {
  test('Should present correct initial state', () => {
    makeSut()
    expect(screen.getByTestId('survey-result')).toBeEmptyDOMElement()
    expect(screen.queryByTestId('error-wrap')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading-wrap')).not.toBeInTheDocument()
  })

  test('Should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = makeSut()
    await screen.findByTestId('survey-result')
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })
})

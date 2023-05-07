import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { type AccountModel } from '@/domain/models'
import { LoadSurveyListSpy, mockAccountModel } from '@/domain/test'
import { ApiContext } from '@/presentation/contexts'
import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import React from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { SurveyList } from './survey-list'

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
  history: ReturnType<typeof createMemoryRouter>
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy(4)): SutTypes => {
  const setCurrentAccountMock = jest.fn()
  const history = createMemoryRouter([
    { path: '/', element: <SurveyList loadSurveyList={loadSurveyListSpy} /> },
    { path: '/login', element: <></> }
  ])
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
  return { loadSurveyListSpy, history, setCurrentAccountMock }
}

describe('SuveyList Component', () => {
  test('Should present 4 empty items on start', async () => {
    makeSut()
    const emptySurveys = await screen.findAllByRole('listitem', {
      name: /survey-empty$/i
    })
    expect(screen.queryByTestId('error-wrap')).not.toBeInTheDocument()
    expect(emptySurveys).toHaveLength(4)
  })

  test('Should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut()
    await screen.findByRole('heading')
    expect(loadSurveyListSpy.callsCount).toBe(1)
  })

  test('Should render SurveyItems on success', async () => {
    makeSut()
    const surveys = await screen.findAllByRole('listitem', { name: /survey$/i })
    expect(screen.queryByTestId('error-wrap')).not.toBeInTheDocument()
    expect(surveys).toHaveLength(4)
  })

  test('Should render Error on UnexpectedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error)
    makeSut(loadSurveyListSpy)
    const errorMessage = await screen.findByText(error.message)
    const surveyList = screen.queryByRole('list')
    expect(surveyList).not.toBeInTheDocument()
    expect(errorMessage).toBeInTheDocument()
  })

  test('Should logout on AccessDeniedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest
      .spyOn(loadSurveyListSpy, 'loadAll')
      .mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut(loadSurveyListSpy)
    await screen.findByRole('heading')
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.state.location.pathname).toBe('/login')
  })

  test('Should call LoadSurveyList on reload', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest
      .spyOn(loadSurveyListSpy, 'loadAll')
      .mockRejectedValueOnce(new UnexpectedError())
    makeSut(loadSurveyListSpy)
    const button = await screen.findByRole('button', {
      name: /tentar novamente/i
    })
    await user.click(button)
    expect(loadSurveyListSpy.callsCount).toBe(1)
  })
})

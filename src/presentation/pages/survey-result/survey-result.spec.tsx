import React from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { render, screen, waitFor, within } from '@testing-library/react'
import {
  LoadSurveyResultSpy,
  mockAccountModel,
  mockSurveyResultModel
} from '@/domain/test'
import { ApiContext } from '@/presentation/contexts'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { type AccountModel } from '@/domain/models'
import user from '@testing-library/user-event'
import { SurveyResult } from './survey-result'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
  history: ReturnType<typeof createMemoryRouter>
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSut = (loadSurveyResultSpy = new LoadSurveyResultSpy()): SutTypes => {
  const setCurrentAccountMock = jest.fn()
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
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => mockAccountModel()
      }}
    >
      <RouterProvider router={history} />
    </ApiContext.Provider>
  )
  return { loadSurveyResultSpy, history, setCurrentAccountMock }
}

describe('SurveyResult Component', () => {
  test('Should present correct initial state', async () => {
    makeSut()
    const surveyResult = screen.getByTestId('survey-result')
    expect(surveyResult).toBeEmptyDOMElement()
    expect(screen.queryByTestId('error-wrap')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading-wrap')).not.toBeInTheDocument()
    await waitFor(() => surveyResult)
  })

  test('Should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = makeSut()
    await screen.findByTestId('survey-result')
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })

  test('Should call LoadSurveyResult', async () => {
    const loadSurveyListSpy = new LoadSurveyResultSpy()
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2020-01-10T00:00:00')
    })
    loadSurveyListSpy.surveyResult = surveyResult
    makeSut(loadSurveyListSpy)
    await screen.findByTestId('survey-result')
    expect(screen.getByTestId('day')).toHaveTextContent('10')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2020')
    expect(screen.getByRole('heading')).toHaveTextContent(surveyResult.question)
    const answersLI = screen.getAllByRole('listitem')
    expect(answersLI).toHaveLength(surveyResult.answers.length)

    surveyResult.answers.forEach((answerResponse, index) => {
      const answerWrap = answersLI[index]
      const image = within(answerWrap).queryByRole('img')
      const answerComponent = within(answerWrap).getByTestId('answer')
      const percentComponent = within(answerWrap).getByTestId('percent')
      if (answerResponse.isCurrenctAccountAnswer) {
        expect(answerWrap).toHaveClass('active')
      }
      if (image) {
        expect(image).toHaveAttribute('src', answerResponse.image)
      } else {
        expect(image).not.toBeInTheDocument()
      }
      expect(answerComponent).toHaveTextContent(answerResponse.answer)
      expect(percentComponent).toHaveTextContent(`${answerResponse.percent}%`)
    })
  })

  test('Should render Error on UnexpectedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(error)
    makeSut(loadSurveyResultSpy)
    expect(screen.queryAllByRole('li')).toHaveLength(0)
    expect(screen.queryByTestId('loading-wrap')).not.toBeInTheDocument()
    const errorMessage = await screen.findByText(error.message)
    expect(errorMessage).toBeInTheDocument()
  })

  test('Should logout on AccessDeniedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest
      .spyOn(loadSurveyResultSpy, 'load')
      .mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut(loadSurveyResultSpy)
    await screen.findByRole('link')
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.state.location.pathname).toBe('/login')
  })

  test('Should call LoadSurveyResult on reload', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest
      .spyOn(loadSurveyResultSpy, 'load')
      .mockRejectedValueOnce(new UnexpectedError())
    makeSut(loadSurveyResultSpy)
    const button = await screen.findByRole('button', {
      name: /tentar novamente/i
    })
    await user.click(button)
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })
})

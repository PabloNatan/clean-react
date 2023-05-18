import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { type AccountModel } from '@/domain/models'
import {
  LoadSurveyResultSpy,
  SaveSurveyResultSpy,
  mockAccountModel,
  mockSurveyResultModel
} from '@/domain/test'
import { ApiContext } from '@/presentation/contexts'
import { render, screen, waitFor, within } from '@testing-library/react'
import user from '@testing-library/user-event'
import React from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { SurveyResult } from './survey-result'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
  history: ReturnType<typeof createMemoryRouter>
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  loadSurveyResultSpy?: LoadSurveyResultSpy
  saveSurveyResultSpy?: SaveSurveyResultSpy
  navHistory?: {
    initialIndex: number
    initialEntries: string[]
  }
}

const makeSut = ({
  saveSurveyResultSpy = new SaveSurveyResultSpy(),
  loadSurveyResultSpy = new LoadSurveyResultSpy(),
  navHistory = {
    initialIndex: 0,
    initialEntries: ['/surveys/:id']
  }
}: SutParams = {}): SutTypes => {
  const setCurrentAccountMock = jest.fn()
  const history = createMemoryRouter(
    [
      { path: '/', element: <></> },
      { path: '/login', element: <></> },
      {
        path: '/surveys/:id',
        element: (
          <SurveyResult
            loadSurveyResult={loadSurveyResultSpy}
            saveSurveyResult={saveSurveyResultSpy}
          />
        )
      }
    ],
    navHistory
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
  return {
    loadSurveyResultSpy,
    history,
    saveSurveyResultSpy,
    setCurrentAccountMock
  }
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

  test('Should present SurveyResult data on LoadSurveyResult success', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2020-01-10T00:00:00')
    })
    loadSurveyResultSpy.surveyResult = surveyResult
    makeSut({ loadSurveyResultSpy })
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

  test('Should render Error on LoadSurveyResultSpy throw UnexpectedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(error)
    makeSut({ loadSurveyResultSpy })
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.queryByTestId('loading-wrap')).not.toBeInTheDocument()
    const errorMessage = await screen.findByText(error.message)
    expect(errorMessage).toBeInTheDocument()
  })

  test('Should logout on LoadSurveyResultSpy throw AccessDeniedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest
      .spyOn(loadSurveyResultSpy, 'load')
      .mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut({ loadSurveyResultSpy })
    await screen.findByRole('link')
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.state.location.pathname).toBe('/login')
  })

  test('Should call LoadSurveyResult on reload', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest
      .spyOn(loadSurveyResultSpy, 'load')
      .mockRejectedValueOnce(new UnexpectedError())
    makeSut({ loadSurveyResultSpy })
    const button = await screen.findByRole('button', {
      name: /tentar novamente/i
    })
    await user.click(button)
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })

  test('Should go to SurveyList on back button click', async () => {
    const { history } = makeSut({
      navHistory: {
        initialIndex: 1,
        initialEntries: ['/', '/surveys/:id']
      }
    })
    const backbutton = await screen.findByRole('button', {
      name: /voltar/i
    })
    await user.click(backbutton)
    expect(history.state.location.pathname).toBe('/')
  })

  test('Should not present Loading on active answer click', async () => {
    makeSut()
    const surveys = await screen.findAllByRole('listitem')
    await user.click(surveys[0])
    expect(screen.queryByTestId('loading-wrap')).not.toBeInTheDocument()
  })

  test('Should call SaveSurveyResult on non active answer click', async () => {
    const { saveSurveyResultSpy, loadSurveyResultSpy } = makeSut()
    const surveys = await screen.findAllByRole('listitem')
    await user.click(surveys[1])
    expect(screen.queryByTestId('loading-wrap')).toBeInTheDocument()
    expect(saveSurveyResultSpy.params).toEqual({
      answer: loadSurveyResultSpy.surveyResult.answers[1].answer
    })
  })

  test('Should render error when SaveSurveyResultSpy throw UnexpectedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(error)
    makeSut({ saveSurveyResultSpy })
    const listItens = await screen.findAllByRole('listitem')
    await user.click(listItens[1])
    expect(screen.queryByTestId('survey-header')).not.toBeInTheDocument()
    const errorMessage = await screen.findByText(error.message)
    expect(errorMessage).toBeInTheDocument()
    expect(screen.queryByTestId('loading-wrap')).not.toBeInTheDocument()
  })

  test('Should logout when SaveSurveyResultSpy throw AccessDeniedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    jest
      .spyOn(saveSurveyResultSpy, 'save')
      .mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut({ saveSurveyResultSpy })
    const listItens = await screen.findAllByRole('listitem')
    await user.click(listItens[1])
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.state.location.pathname).toBe('/login')
  })

  test('Should present SurveyResult data on SaveSurveyResult success', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2018-05-10T00:00:00')
    })
    saveSurveyResultSpy.surveyResult = surveyResult
    makeSut({ saveSurveyResultSpy })
    const listItens = await screen.findAllByRole('listitem')
    await user.click(listItens[1])
    await screen.findByTestId('loading-wrap')
    await screen.findByTestId('survey-header')
    expect(screen.getByTestId('day')).toHaveTextContent('10')
    expect(screen.getByTestId('month')).toHaveTextContent('mai')
    expect(screen.getByTestId('year')).toHaveTextContent('2018')
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
    expect(screen.queryByTestId('loading-wrap')).not.toBeInTheDocument()
  })

  test('Should prevent multiple answer click', async () => {
    const { saveSurveyResultSpy } = makeSut()
    const listItens = await screen.findAllByRole('listitem')
    await user.click(listItens[1])
    await user.click(listItens[1])
    await screen.findByTestId('survey-header')
    expect(saveSurveyResultSpy.callsCount).toBe(1)
  })
})

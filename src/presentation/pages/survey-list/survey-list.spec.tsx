import { UnexpectedError } from '@/domain/errors'
import { LoadSurveyListSpy } from '@/domain/test'
import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import React from 'react'
import { SurveyList } from './survey-list'

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy(4)): SutTypes => {
  render(<SurveyList loadSurveyList={loadSurveyListSpy} />)
  return { loadSurveyListSpy }
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

  test('Should render Error on fail', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error)
    makeSut(loadSurveyListSpy)
    const errorMessage = await screen.findByText(error.message)
    const surveyList = screen.queryByRole('list')
    expect(surveyList).not.toBeInTheDocument()
    expect(errorMessage).toBeInTheDocument()
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

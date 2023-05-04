import React from 'react'
import { render, screen } from '@testing-library/react'
import { SurveyList } from './survey-list'
import { type LoadSurveyList } from '@/domain/usecases'
import { type SurveyModel } from '@/domain/models'
import { mockSurveyList } from '@/domain/test'

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0
  async loadAll(): Promise<SurveyModel[]> {
    this.callsCount++
    return mockSurveyList()
  }
}

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyListSpy = new LoadSurveyListSpy()
  render(<SurveyList loadSurveyList={loadSurveyListSpy} />)
  return { loadSurveyListSpy }
}

describe('SuveyList Component', () => {
  test('Should present 4 empty items on start', () => {
    makeSut()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  test('Should call LoadSurveyList', () => {
    const { loadSurveyListSpy } = makeSut()
    expect(loadSurveyListSpy.callsCount).toBe(1)
  })
})

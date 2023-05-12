import { faker } from '@faker-js/faker'
import { type LoadSurveyResult } from '../usecases'

export const mockSurveyResultModel = (): LoadSurveyResult.Model => ({
  question: faker.random.words(10),
  date: faker.date.past(),
  answers: [
    {
      image: faker.image.technics(undefined, undefined, true),
      answer: faker.random.words(),
      percent: faker.datatype.number({ min: 0, max: 100 }),
      isCurrenctAccountAnswer: true,
      count: faker.datatype.number()
    },
    {
      answer: faker.random.words(),
      percent: faker.datatype.number({ min: 0, max: 100 }),
      isCurrenctAccountAnswer: false,
      count: faker.datatype.number()
    }
  ]
})

export class LoadSurveyResultSpy implements LoadSurveyResult {
  callsCount = 0
  surveyResult = mockSurveyResultModel()
  async load(): Promise<LoadSurveyResult.Model> {
    this.callsCount++
    return this.surveyResult
  }
}

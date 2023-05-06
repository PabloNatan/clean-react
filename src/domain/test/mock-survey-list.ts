import { faker } from '@faker-js/faker'
import { type LoadSurveyList } from '../usecases'

export const mockSurveyModel = (): LoadSurveyList.Model => ({
  id: faker.datatype.uuid(),
  question: faker.random.words(10),
  date: faker.date.past(),
  didAnswer: faker.datatype.boolean()
})

export const mockSurveyList = (numberOfSurveys = 4): LoadSurveyList.Model[] =>
  Array.from({ length: numberOfSurveys }, () => '').map(mockSurveyModel)

export class LoadSurveyListSpy implements LoadSurveyList {
  constructor(private readonly numberOfSurveys = 5) {}
  callsCount = 0
  async loadAll(): Promise<LoadSurveyList.Model[]> {
    this.callsCount++
    return mockSurveyList(this.numberOfSurveys)
  }
}

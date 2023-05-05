import { faker } from '@faker-js/faker'
import { type SurveyModel } from '../models'

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.datatype.uuid(),
  question: faker.random.words(10),
  date: faker.date.past(),
  didAnswer: faker.datatype.boolean(),
  answers: [{ answer: faker.random.words(4), image: faker.image.imageUrl() }]
})

export const mockSurveyList = (numberOfSurveys = 4): SurveyModel[] =>
  Array.from({ length: numberOfSurveys }, () => '').map(mockSurveyModel)

import { faker } from '@faker-js/faker'
import { type SurveyModel } from '../models'

const surveys = Array.from({ length: 5 }, () => '')

export const mockSurveyModal = (): SurveyModel => ({
  id: faker.datatype.uuid(),
  question: faker.random.words(10),
  date: faker.date.past(),
  didAnswer: faker.datatype.boolean(),
  answers: [{ answer: faker.random.words(4), image: faker.image.imageUrl() }]
})

export const mockSurveyList = (): SurveyModel[] => surveys.map(mockSurveyModal)

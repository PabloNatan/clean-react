import { faker } from '@faker-js/faker'
import { type RemoteLoadSurveyList } from '@/data/usecases'

export const mockRemoteSurvey = (): RemoteLoadSurveyList.Model => ({
  id: faker.datatype.uuid(),
  question: faker.random.words(10),
  date: faker.date.past().toISOString(),
  didAnswer: faker.datatype.boolean()
})

export const mockRemoteSurveyList = (
  numberOfSurveys = 4
): RemoteLoadSurveyList.Model[] =>
  Array.from({ length: numberOfSurveys }, () => '').map(mockRemoteSurvey)

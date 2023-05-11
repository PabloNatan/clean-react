import { type RemoteLoadSurveyResult } from '@/data/usecases'
import { faker } from '@faker-js/faker'

export const mockRemoteSurveyResultModel =
  (): RemoteLoadSurveyResult.Model => ({
    question: faker.random.words(10),
    date: faker.date.past().toISOString(),
    answers: [
      {
        image: faker.image.imageUrl(),
        answer: faker.random.words(),
        count: faker.datatype.number(),
        percent: +faker.random.numeric(2),
        isCurrenctAccountAnswer: faker.datatype.boolean()
      },
      {
        image: faker.image.imageUrl(),
        answer: faker.random.words(),
        count: faker.datatype.number(),
        percent: +faker.random.numeric(2),
        isCurrenctAccountAnswer: faker.datatype.boolean()
      }
    ]
  })

import { faker } from '@faker-js/faker'
import { type HttpPostParams } from '../protocols/http'
import { randomObject } from '@/test'

export const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: randomObject
})

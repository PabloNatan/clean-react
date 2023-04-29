import { faker } from '@faker-js/faker'
import {
  type HttpResponse,
  type HttpPostParams,
  HttpStatusCode,
  type HttpPostClient
} from '../protocols/http'
import { randomObject } from '@/test'

export const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: randomObject
})

export class HttpPostClientSpy<T, R> implements HttpPostClient<T, R> {
  url?: string
  body?: T
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok
  }

  async post(params: HttpPostParams<T>): Promise<HttpResponse<R>> {
    this.url = params.url
    this.body = params.body
    return Promise.resolve(this.response)
  }
}

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

export class HttpPostClientSpy<BodyType, ResponseType>
  implements HttpPostClient<BodyType, ResponseType>
{
  url?: string
  body?: BodyType
  response: HttpResponse<ResponseType> = {
    statusCode: HttpStatusCode.ok
  }

  async post(
    params: HttpPostParams<BodyType>
  ): Promise<HttpResponse<ResponseType>> {
    this.url = params.url
    this.body = params.body
    return Promise.resolve(this.response)
  }
}

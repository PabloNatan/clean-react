import { randomObject } from '@/test'
import { faker } from '@faker-js/faker'
import {
  HttpStatusCode,
  type HttpClient,
  type HttpMethod,
  type HttpRequest,
  type HttpResponse
} from '../protocols/http'

export const randomHttpMethod = (): HttpMethod =>
  faker.helpers.arrayElement(['put', 'post', 'get'])

export const mocktHttpRequest = (): HttpRequest<any> => ({
  url: faker.internet.url(),
  body: randomObject(),
  headers: randomObject(),
  method: randomHttpMethod()
})

export class HttpClientSpy<ResponseType = any, BodyType = any>
  implements HttpClient<ResponseType>
{
  url?: string
  method?: HttpMethod
  headers?: any
  body?: BodyType
  response: HttpResponse<ResponseType> = {
    statusCode: HttpStatusCode.ok
  }

  async request(
    params: HttpRequest<BodyType>
  ): Promise<HttpResponse<ResponseType>> {
    this.url = params.url
    this.method = params.method
    this.body = params.body
    this.headers = params.headers
    return Promise.resolve(this.response)
  }
}

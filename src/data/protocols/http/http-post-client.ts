import { type HttpResponse } from './http-response'

export type HttpPostParams<BodyType = any> = {
  url: string
  body?: BodyType
}
export interface HttpPostClient<BodyType = any, ResponseType = any> {
  post: (
    params: HttpPostParams<BodyType>
  ) => Promise<HttpResponse<ResponseType>>
}

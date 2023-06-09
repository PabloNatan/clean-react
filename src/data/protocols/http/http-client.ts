export type HttpRequest<BodyType = any> = {
  url: string
  method: HttpMethod
  body?: BodyType
  headers?: any
}

export interface HttpClient<ResponseType = any, BodyType = any> {
  request: (data: HttpRequest<BodyType>) => Promise<HttpResponse<ResponseType>>
}

export type HttpMethod = 'post' | 'get' | 'put'

export enum HttpStatusCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  serverError = 500
}

export type HttpResponse<BodyType = any> = {
  statusCode: HttpStatusCode
  body?: BodyType
}

import axios, { type AxiosResponse } from 'axios'
import {
  type HttpResponse,
  type HttpPostParams,
  type HttpPostClient
} from '@/data/protocols/http'

export class AxiosHttpClient implements HttpPostClient {
  async post(params: HttpPostParams): Promise<HttpResponse> {
    let httpResponse: AxiosResponse<any>
    try {
      httpResponse = await axios.post(params.url, params.body)
    } catch (error) {
      httpResponse = error.response
    }
    return {
      statusCode: httpResponse.status,
      body: httpResponse.data
    }
  }
}

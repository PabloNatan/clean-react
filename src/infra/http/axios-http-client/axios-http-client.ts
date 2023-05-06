import axios, { type AxiosResponse } from 'axios'
import {
  type HttpResponse,
  type HttpPostParams,
  type HttpPostClient,
  type HttpGetParams
} from '@/data/protocols/http'

export class AxiosHttpClient implements HttpPostClient {
  private adapt(axiosResponse: AxiosResponse): HttpResponse {
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    }
  }

  async post(params: HttpPostParams): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse
    try {
      axiosResponse = await axios.post(params.url, params.body)
    } catch (error) {
      axiosResponse = error.response
    }
    return this.adapt(axiosResponse)
  }

  async get(params: HttpGetParams): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse
    try {
      axiosResponse = await axios.get(params.url, { headers: params.headers })
    } catch (error) {
      axiosResponse = error.response
    }
    return this.adapt(axiosResponse)
  }
}

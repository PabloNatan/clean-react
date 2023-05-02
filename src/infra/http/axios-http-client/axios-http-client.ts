import axios, { type AxiosResponse } from 'axios'
import {
  type HttpResponse,
  type HttpPostParams,
  type HttpPostClient,
  type HttpGetParams
} from '@/data/protocols/http'

export class AxiosHttpClient implements HttpPostClient {
  async post(params: HttpPostParams): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse<any>
    try {
      axiosResponse = await axios.post(params.url, params.body)
    } catch (error) {
      axiosResponse = error.response
    }
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    }
  }

  async get(params: HttpGetParams): Promise<HttpResponse> {
    const axiosResponse = await axios.get(params.url)
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    }
  }
}

import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { faker } from '@faker-js/faker'

import { HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { RemoteSaveSurveyResult } from './remote-save-survey-result'
import { mockSaveSurveyResultParams } from '@/domain/test'

type SutTypes = {
  sut: RemoteSaveSurveyResult
  httpGetClientSpy: HttpClientSpy<RemoteSaveSurveyResult.Model>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpClientSpy<RemoteSaveSurveyResult.Model>()
  const sut = new RemoteSaveSurveyResult(url, httpGetClientSpy)
  return { sut, httpGetClientSpy }
}

const validateErroThrown = async (
  statusCode: HttpStatusCode,
  error: any
): Promise<void> => {
  const { httpGetClientSpy, sut } = makeSut()
  httpGetClientSpy.response = {
    statusCode
  }
  const promise = sut.save(mockSaveSurveyResultParams())
  await expect(promise).rejects.toThrow(error)
}

describe('RemoteSaveSurveyResult', () => {
  test('Should call HttpClient with correct values', async () => {
    const url = faker.internet.url()
    const { sut, httpGetClientSpy } = makeSut(url)
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockRemoteSurveyResultModel()
    }
    const saveSurveyResultParams = mockSaveSurveyResultParams()
    sut.save(saveSurveyResultParams)
    expect(httpGetClientSpy.url).toBe(url)
    expect(httpGetClientSpy.method).toBe('put')
    expect(httpGetClientSpy.body).toBe(saveSurveyResultParams)
  })

  test('Should throw AccessDeniedError if HttpClient returns 401', async () => {
    validateErroThrown(HttpStatusCode.unauthorized, new AccessDeniedError())
  })

  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    validateErroThrown(HttpStatusCode.notFound, new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    validateErroThrown(HttpStatusCode.serverError, new UnexpectedError())
  })

  test('Should return a list of LoadSurveyResult.Model if HttpClient returns 200', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    const httpResult = mockRemoteSurveyResultModel()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const httpResponse = await sut.save(mockSaveSurveyResultParams())
    expect(httpResponse).toEqual({
      question: httpResult.question,
      answers: httpResult.answers,
      date: new Date(httpResponse.date)
    })
  })
})

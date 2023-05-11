import { HttpGetClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { faker } from '@faker-js/faker'
import { RemoteLoadSurveyResult } from './remote-load-survey-result'
import { HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'

type SutTypes = {
  sut: RemoteLoadSurveyResult
  httpGetClientSpy: HttpGetClientSpy
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy()
  const sut = new RemoteLoadSurveyResult(url, httpGetClientSpy)
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
  const promise = sut.load()
  await expect(promise).rejects.toThrow(error)
}

describe('RemoteLoadSurveyResult', () => {
  test('Should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpGetClientSpy } = makeSut(url)
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockRemoteSurveyResultModel()
    }
    sut.load()
    expect(httpGetClientSpy.url).toBe(url)
  })

  test('Should throw AccessDeniedError if HttpGetclient returns 401', async () => {
    validateErroThrown(HttpStatusCode.unauthorized, new AccessDeniedError())
  })

  test('Should throw UnexpectedError if HttpGetclient returns 404', async () => {
    validateErroThrown(HttpStatusCode.notFound, new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpGetclient returns 500', async () => {
    validateErroThrown(HttpStatusCode.serverError, new UnexpectedError())
  })

  test('Should return a list of LoadSurveyResult.Model if HttpGetClient returns 200', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    const httpResult = mockRemoteSurveyResultModel()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const httpResponse = await sut.load()
    expect(httpResponse).toEqual({
      question: httpResult.question,
      answers: httpResult.answers,
      date: new Date(httpResponse.date)
    })
  })
})

import { HttpGetClientSpy } from '@/data/test'
import { type SurveyModel } from '@/domain/models'
import { faker } from '@faker-js/faker'
import { RemoteLoadSurveyList } from './load-survey-list'
import { HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/errors'
import { mockSurveyList } from '@/domain/test/mock-survey-list'

type SutTypes = {
  sut: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy<SurveyModel[]>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<SurveyModel[]>()
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy)
  return { sut, httpGetClientSpy }
}

describe('RemoteLoadSurveyLIst', () => {
  it('Should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url()
    const { httpGetClientSpy, sut } = makeSut(url)
    await sut.loadAll()
    expect(httpGetClientSpy.url).toBe(url)
  })

  it('Should throw UnexpectedError if HttpGetClient returns 403', async () => {
    const { httpGetClientSpy, sut } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  it('Should throw UnexpectedError if HttpGetClient returns 404', async () => {
    const { httpGetClientSpy, sut } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  it('Should throw UnexpectedError if HttpGetClient returns 500', async () => {
    const { httpGetClientSpy, sut } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  it('Should return a list of SurveyModels if HttpGetClient returns 200', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    const httpResult = mockSurveyList()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const surveyList = await sut.loadAll()
    expect(surveyList).toEqual(httpResult)
  })

  it('Should return an empty list if HttpGetClient return 204', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }
    const surveyList = await sut.loadAll()
    expect(surveyList).toEqual([])
  })
})
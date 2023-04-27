import { HttpStatusCode } from '@/data/protocols/http'
import { HttpPostClientSpy } from '@/data/test'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { type AccountModel } from '@/domain/models'
import { mockAuthentication, mockAccountModel } from '@/domain/test'
import { type AuthenticationParams } from '@/domain/usecases'

import { faker } from '@faker-js/faker'
import { RemoteAuthentication } from './remote-authentication'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<
    AuthenticationParams,
    AccountModel
  >()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)
  return {
    httpPostClientSpy,
    sut
  }
}

async function validErrorThrowed<T extends Error>(
  statusCode: HttpStatusCode,
  CustomError: new (...args: any[]) => T
): Promise<void> {
  const { sut, httpPostClientSpy } = makeSut()
  httpPostClientSpy.response = {
    statusCode
  }
  const promise = sut.auth(mockAuthentication())
  await expect(promise).rejects.toThrow(new CustomError())
}

describe('RemoteAuthentication', () => {
  test('Should call HttpClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.auth(mockAuthentication())

    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpPostClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const authenticationParams = mockAuthentication()
    await sut.auth(authenticationParams)
    expect(httpPostClientSpy.body).toEqual(authenticationParams)
  })

  test('Should throw InvalidCredentialsError if HttpPostCLient returns 401', async () => {
    await validErrorThrowed(
      HttpStatusCode.unauthorized,
      InvalidCredentialsError
    )
  })

  test('Should throw UnexpectedError if HttpPostCLient returns 400', async () => {
    await validErrorThrowed(HttpStatusCode.badRequest, UnexpectedError)
  })

  test('Should throw UnexpectedError if HttpPostCLient returns 404', async () => {
    await validErrorThrowed(HttpStatusCode.notFound, UnexpectedError)
  })

  test('Should throw UnexpectedError if HttpPostCLient returns 500', async () => {
    await validErrorThrowed(HttpStatusCode.serverError, UnexpectedError)
  })

  test('Should return an AccountModel if HttpPostClient returns 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const httpResult = mockAccountModel()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const account = await sut.auth(mockAuthentication())
    expect(account).toEqual(httpResult)
  })
})

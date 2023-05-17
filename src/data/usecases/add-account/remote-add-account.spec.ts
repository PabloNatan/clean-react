import { HttpClientSpy } from '@/data/test'

import { type AddAccount } from '@/domain/usecases'
import { RemoteAddAccount } from './remote-add-account'

import { HttpStatusCode } from '@/data/protocols/http'
import { EmailInUseError, UnexpectedError } from '@/domain/errors'
import { mockAccountModel, mockAddAccountParams } from '@/domain/test'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: RemoteAddAccount
  httpPostClientSpy: HttpClientSpy<RemoteAddAccount.Model, AddAccount.Params>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpClientSpy<
    RemoteAddAccount.Model,
    AddAccount.Params
  >()
  httpPostClientSpy.response = {
    statusCode: HttpStatusCode.created
  }
  const sut = new RemoteAddAccount(url, httpPostClientSpy)
  return {
    sut,
    httpPostClientSpy
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
  const promise = sut.add(mockAddAccountParams())
  await expect(promise).rejects.toThrow(new CustomError())
}

describe('RemoteAddAccount', () => {
  test('Should call HttpClient with correct values', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(httpPostClientSpy.url).toBe(url)
    expect(httpPostClientSpy.method).toBe('post')
    expect(httpPostClientSpy.body).toEqual(addAccountParams)
  })

  test('Should throw EmailInUseError if HttpClient return 403', async () => {
    await validErrorThrowed(HttpStatusCode.forbidden, EmailInUseError)
  })

  test('Should throw UnexpectedError if HttpClient return 400', async () => {
    await validErrorThrowed(HttpStatusCode.badRequest, UnexpectedError)
  })

  test('Should throw UnexpectedError if HttpPostCLient returns 404', async () => {
    await validErrorThrowed(HttpStatusCode.notFound, UnexpectedError)
  })

  test('Should throw UnexpectedError if HttpPostCLient returns 500', async () => {
    await validErrorThrowed(HttpStatusCode.serverError, UnexpectedError)
  })

  test('Should return an AddAccount.Model if HttpClient returns 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const httpResult = mockAccountModel()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.created,
      body: httpResult
    }
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual(httpResult)
  })
})

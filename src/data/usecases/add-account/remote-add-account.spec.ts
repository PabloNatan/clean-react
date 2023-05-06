import { HttpPostClientSpy } from '@/data/test'

import { type AddAccount } from '@/domain/usecases'
import { RemoteAddAccount } from './remote-add-account'

import { HttpStatusCode } from '@/data/protocols/http'
import { EmailInUseError, UnexpectedError } from '@/domain/errors'
import { mockAccountModel, mockAddAccountParams } from '@/domain/test'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: RemoteAddAccount
  httpPostClientSpy: HttpPostClientSpy<
    AddAccount.Params,
    RemoteAddAccount.Model
  >
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<
    AddAccount.Params,
    RemoteAddAccount.Model
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
  test('Should call HttpClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.add(mockAddAccountParams())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpPostClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(httpPostClientSpy.body).toEqual(addAccountParams)
  })

  test('Should throw EmailInUseError if HttpPostClient return 403', async () => {
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

  test('Should return an AddAccount.Model if HttpPostClient returns 200', async () => {
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

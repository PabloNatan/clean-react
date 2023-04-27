import { HttpPostClientSpy } from '@/data/test'
import { type AccountModel } from '@/domain/models'
import { type AddAccountParams } from '@/domain/usecases'
import { RemoteAddAccount } from './remote-add-account'

import { mockAddAccount } from '@/domain/test'
import { faker } from '@faker-js/faker'
import { HttpStatusCode } from '@/data/protocols/http'
import { EmailInUseError, UnexpectedError } from '@/domain/errors'

type SutTypes = {
  sut: RemoteAddAccount
  httpPostClientSpy: HttpPostClientSpy<AddAccountParams, AccountModel>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<
    AddAccountParams,
    AccountModel
  >()
  const sut = new RemoteAddAccount(url, httpPostClientSpy)
  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAddAccount', () => {
  test('Should call HttpClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.add(mockAddAccount())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpPostClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const addAccountParams = mockAddAccount()
    await sut.add(addAccountParams)
    expect(httpPostClientSpy.body).toEqual(addAccountParams)
  })

  test('Should throw EmailInUseError if HttpPostClient return 403', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.add(mockAddAccount())
    await expect(promise).rejects.toThrow(new EmailInUseError())
  })

  test('Should throw UnexpectedError if HttpClient return 400', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = sut.add(mockAddAccount())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPostCLient returns 404', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.add(mockAddAccount())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPostCLient returns 500', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.add(mockAddAccount())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})

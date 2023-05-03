import { SetStorageMock } from '@/data/test'
import { UnexpectedError } from '@/domain/errors'
import { type AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { LocalUpdateCurrentAccount } from './local-update-current-account'

type SutTypes = {
  sut: LocalUpdateCurrentAccount
  setStorageMock: SetStorageMock
}

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock()
  const sut = new LocalUpdateCurrentAccount(setStorageMock)

  return {
    sut,
    setStorageMock
  }
}

describe('LocalUpdateCurrentAccount', () => {
  test('Should call SetStorage with correct value', async () => {
    const { sut, setStorageMock } = makeSut()
    const account: AccountModel = mockAccountModel()
    sut.save(account)
    expect(setStorageMock.key).toBe('account')
    expect(setStorageMock.value).toBe(JSON.stringify(account))
  })

  test('Should throw if SetStorage throws', async () => {
    const { sut, setStorageMock } = makeSut()
    const error = new Error('Invalid Storage')
    try {
      jest.spyOn(setStorageMock, 'value').mockRejectedValue(() => error)
      sut.save(mockAccountModel())
    } catch (receivedError) {
      expect(receivedError).toEqual(error)
    }
  })

  test('Should throw if account is falsy', async () => {
    try {
      const { sut } = makeSut()
      sut.save(undefined)
    } catch (error) {
      expect(error).toEqual(new UnexpectedError())
    }
  })
})

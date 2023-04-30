import { SetStorageMock } from '@/data/test'
import { faker } from '@faker-js/faker'
import { LocalSaveAccessToken } from './local-save-access-token'
import { UnexpectedError } from '@/domain/errors'

type SutTypes = {
  sut: LocalSaveAccessToken
  setStorageMock: SetStorageMock
}

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock()
  const sut = new LocalSaveAccessToken(setStorageMock)

  return {
    sut,
    setStorageMock
  }
}

describe('LocalSaveAccessToken', () => {
  test('Should call SetStorage with correct value', async () => {
    const { sut, setStorageMock } = makeSut()
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)
    expect(setStorageMock.key).toBe('accessToken')
    expect(setStorageMock.value).toBe(accessToken)
  })

  test('Should throw if SetStorage throws', async () => {
    const { sut, setStorageMock } = makeSut()
    const error = new Error('Invalid Storage')
    try {
      jest.spyOn(setStorageMock, 'value').mockRejectedValue(error)
      await sut.save(faker.datatype.uuid())
    } catch (receivedError) {
      expect(receivedError).toEqual(error)
    }
  })

  test('Should throw if accessToken is falsy', async () => {
    const { sut } = makeSut()
    const promise = sut.save(undefined)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})

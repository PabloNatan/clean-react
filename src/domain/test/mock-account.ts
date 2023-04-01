import faker from 'faker'
import { type AuthenticationParams } from '@/domain/usecases/authetication'
import { type AccountModel } from '../models/account-model'

export const mockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.datatype.uuid()
})

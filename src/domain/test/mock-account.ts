import { faker } from '@faker-js/faker'
import { type AccountModel } from '../models/account-model'

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.datatype.uuid(),
  name: faker.name.fullName()
})

import { faker } from '@faker-js/faker'
import { type AddAccountParams } from '../usecases'

export const mockAddAccount = (): AddAccountParams => {
  const password = faker.internet.password()
  return {
    email: faker.internet.email(),
    name: faker.name.fullName(),
    password,
    passwordConfirmation: password
  }
}

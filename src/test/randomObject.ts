import { faker } from '@faker-js/faker'
export const randomObject = (): object => ({
  name: faker.name.firstName(),
  email: faker.internet.email(),
  address: {
    street: faker.address.street(),
    city: faker.address.city(),
    state: faker.address.state(),
    zipCode: faker.address.zipCode()
  },
  phone: faker.phone.number(),
  company: faker.company.name()
})

import { faker } from '@faker-js/faker'
export const randomObject = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
  address: {
    street: faker.address.streetName(),
    city: faker.address.city(),
    state: faker.address.state(),
    zipCode: faker.address.zipCode()
  },
  phone: faker.phone.number(),
  company: faker.company.name()
}

import faker from "faker";
import { AuthenticationParams } from "@/domain/usecases/authetication";

export const mockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

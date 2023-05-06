import { type HttpGetClient } from '@/data/protocols/http'
import { AuthorizeHttpGetClientDecorator } from '@/main/decorators'
import { makeLocalStorafeAdapter } from '@/main/factories/cache'
import { makeAxiosHttpClient } from '@/main/factories/http'

export const makeAuthorizeHttpGetClientDecorator = (): HttpGetClient => {
  return new AuthorizeHttpGetClientDecorator(
    makeLocalStorafeAdapter(),
    makeAxiosHttpClient()
  )
}

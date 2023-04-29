import { RemoteAddAccount } from '@/data/usecases/add-account/remote-add-account'
import { type AddAccount } from '@/domain/usecases'
import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http'

export const makeRemoteAddAccount = (): AddAccount => {
  return new RemoteAddAccount(makeApiUrl('/auth/signup'), makeAxiosHttpClient())
}

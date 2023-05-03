import { UnexpectedError } from '@/domain/errors'
import { makeLocalStorafeAdapter } from '../factories/cache/local-storage-adapter-factory'
import { type AccountModel } from '@/domain/models'

export const setCurrentAccountAdapter = (account: AccountModel): void => {
  if (!account?.accessToken) {
    throw new UnexpectedError()
  }
  makeLocalStorafeAdapter().set('account', account)
}

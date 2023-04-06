import { type AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import {
  type Authentication,
  type AuthenticationParams
} from '@/domain/usecases'

export class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  params: AuthenticationParams
  callsCount = 0

  async auth(params: AuthenticationParams): Promise<AccountModel> {
    this.params = params
    this.callsCount++
    return Promise.resolve(this.account)
  }
}

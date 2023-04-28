import { type AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { type AddAccount, type AddAccountParams } from '@/domain/usecases'

export class AddAccountSpy implements AddAccount {
  account = mockAccountModel()
  params: AddAccountParams

  async add(params: AddAccountParams): Promise<AccountModel> {
    this.params = params
    return Promise.resolve(this.account)
  }
}

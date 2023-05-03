import { type AccountModel } from '@/domain/models'
import { type UpdateCurrentAccount } from '@/domain/usecases'

export class UpdateCurrentAccountMock implements UpdateCurrentAccount {
  account: AccountModel
  save(account: AccountModel): void {
    this.account = account
  }
}

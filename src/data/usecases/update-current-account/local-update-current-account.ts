import { type SetStorage } from '@/data/protocols/cache/set-storage'
import { UnexpectedError } from '@/domain/errors'
import { type AccountModel } from '@/domain/models'
import { type UpdateCurrentAccount } from '@/domain/usecases/update-current-account'

export class LocalUpdateCurrentAccount implements UpdateCurrentAccount {
  constructor(private readonly setStorage: SetStorage) {}

  save(account: AccountModel): void {
    if (!account) {
      throw new UnexpectedError()
    }
    this.setStorage.set('account', JSON.stringify(account))
  }
}

import { type AccountModel } from '../models'

export interface UpdateCurrentAccount {
  save: (account: AccountModel) => void
}

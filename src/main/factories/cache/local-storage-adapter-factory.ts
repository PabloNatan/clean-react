import { type SetStorage } from '@/data/protocols/cache/set-storage'
import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'

export const makeLocalStorafeAdapter = (): SetStorage => {
  return new LocalStorageAdapter()
}

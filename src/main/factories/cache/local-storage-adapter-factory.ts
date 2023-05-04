import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'

export const makeLocalStorafeAdapter = (): LocalStorageAdapter => {
  return new LocalStorageAdapter()
}

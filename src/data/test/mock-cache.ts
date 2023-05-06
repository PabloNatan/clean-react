import { randomObject } from '@/test'
import { type GetStorage } from '../protocols/cache'

export class GetStorageSpy implements GetStorage {
  key: string
  value: any = randomObject()
  get(key: string): any {
    this.key = key
    return this.value
  }
}

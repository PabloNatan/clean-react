import { type HttpPostClient } from '@/data/protocols/http'
import { type AccountModel } from '@/domain/models'
import { type AddAccount, type AddAccountParams } from '@/domain/usecases'

export class RemoteAddAccount implements AddAccount {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpPostClient<AddAccountParams, AccountModel>
  ) {}

  async add(params: AddAccountParams): Promise<AccountModel> {
    await this.httpClient.post({
      url: this.url,
      body: params
    })
    return { accessToken: '' }
  }
}
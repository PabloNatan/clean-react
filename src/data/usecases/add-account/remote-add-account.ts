import { HttpStatusCode, type HttpPostClient } from '@/data/protocols/http'
import { EmailInUseError } from '@/domain/errors/email-in-use-error'
import { type AccountModel } from '@/domain/models'
import { type AddAccount, type AddAccountParams } from '@/domain/usecases'

export class RemoteAddAccount implements AddAccount {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpPostClient<AddAccountParams, AccountModel>
  ) {}

  async add(params: AddAccountParams): Promise<AccountModel> {
    const httpResponse = await this.httpClient.post({
      url: this.url,
      body: params
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.forbidden:
        throw new EmailInUseError()
    }
    return { accessToken: '' }
  }
}

import { type HttpGetClient } from '@/data/protocols/http'
import { type SurveyModel } from '@/domain/models'

export class RemoteLoadSurveyList {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient<SurveyModel[]>
  ) {}

  async loadAll(): Promise<void> {
    this.httpGetClient.get({ url: this.url })
  }
}

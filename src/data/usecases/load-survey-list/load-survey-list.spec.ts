import { HttpGetClientSpy } from '@/data/test'
import { type SurveyModel } from '@/domain/models'
import { faker } from '@faker-js/faker'
import { RemoteLoadSurveyList } from './load-survey-list'

describe('RemoteLoadSurveyLIst', () => {
  it('Should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url()
    const httpGetClientSpy = new HttpGetClientSpy<SurveyModel[]>()
    const sut = new RemoteLoadSurveyList(url, httpGetClientSpy)
    await sut.loadAll()
    expect(httpGetClientSpy.url).toBe(url)
  })
})

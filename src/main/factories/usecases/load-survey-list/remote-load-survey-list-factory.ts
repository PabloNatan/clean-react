import { makeApiUrl } from '@/main/factories/http'
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'
import { RemoteLoadSurveyList } from '@/data/usecases/load-survey-list/remote-load-survey-list'
import { type LoadSurveyList } from '@/domain/usecases'

export const makeRemoteLoadSurveyList = (): LoadSurveyList => {
  return new RemoteLoadSurveyList(
    makeApiUrl('/surveys'),
    makeAuthorizeHttpClientDecorator()
  )
}

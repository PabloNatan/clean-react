import { RemoteLoadSurveyList } from '@/data/usecases/load-survey-list/load-survey-list'
import { type LoadSurveyList } from '@/domain/usecases'
import { makeApiUrl, makeAxiosHttpClient } from '../../http'

export const makeRemoteLoadSurveyList = (): LoadSurveyList => {
  return new RemoteLoadSurveyList(makeApiUrl('surveys'), makeAxiosHttpClient())
}

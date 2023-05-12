import { RemoteLoadSurveyResult } from '@/data/usecases'
import { makeAuthorizeHttpGetClientDecorator } from '@/main/factories/decorators'
import { makeApiUrl } from '@/main/factories/http'

export const makeRemoteLoadSurveyResult = (
  id: string
): RemoteLoadSurveyResult => {
  return new RemoteLoadSurveyResult(
    makeApiUrl(`/surveys/${id}/results`),
    makeAuthorizeHttpGetClientDecorator()
  )
}

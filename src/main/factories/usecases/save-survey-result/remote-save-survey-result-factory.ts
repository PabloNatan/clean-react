import { RemoteSaveSurveyResult } from '@/data/usecases'
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'
import { makeApiUrl } from '@/main/factories/http'

export const makeRemoteSaveSurveyResult = (
  surveyId: string
): RemoteSaveSurveyResult => {
  return new RemoteSaveSurveyResult(
    makeApiUrl(`/votes/${surveyId}`),
    makeAuthorizeHttpClientDecorator()
  )
}

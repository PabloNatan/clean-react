import { type SurveyModel } from '@/domain/models'
import { createContext, useContext } from 'react'

type SurveyContext = {
  state: {
    error: string
    surveys: SurveyModel[]
  }
  setState: React.Dispatch<
    React.SetStateAction<{
      surveys: SurveyModel[]
      error: string
    }>
  >
}
export const SurveyListContext = createContext<SurveyContext>(null)
export const useSurveyListContext = (): SurveyContext =>
  useContext(SurveyListContext)

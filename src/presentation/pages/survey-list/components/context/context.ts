import { type SurveyModel } from '@/domain/models'
import { createContext, useContext } from 'react'

type SurveyState = {
  error: string
  surveys: SurveyModel[]
  reload: boolean
}

type SurveyContext = {
  state: SurveyState
  setState: React.Dispatch<React.SetStateAction<SurveyState>>
}
export const SurveyListContext = createContext<SurveyContext>(null)
export const useSurveyListContext = (): SurveyContext =>
  useContext(SurveyListContext)

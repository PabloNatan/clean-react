import { type LoadSurveyList } from '@/domain/usecases'
import { createContext, useContext } from 'react'

type SurveyState = {
  error: string
  surveys: LoadSurveyList.Model[]
  reload: boolean
}

type SurveyContext = {
  state: SurveyState
  setState: React.Dispatch<React.SetStateAction<SurveyState>>
}
export const SurveyListContext = createContext<SurveyContext>(null)
export const useSurveyListContext = (): SurveyContext =>
  useContext(SurveyListContext)

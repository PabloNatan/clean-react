import { type LoadSurveyList } from '@/domain/usecases'
import { Footer, Header } from '@/presentation/components'
import {
  Error,
  SurveyListContext,
  SurveyListItem
} from '@/presentation/pages/survey-list/components'
import React, { useEffect, useState } from 'react'
import Styles from './survey-list-styles.scss'
import { AccessDeniedError } from '@/domain/errors'
import { useApiContext } from '@/presentation/contexts'
import { useNavigate } from 'react-router-dom'

type Props = {
  loadSurveyList?: LoadSurveyList
}

export const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const navigate = useNavigate()
  const { setCurrentAccount } = useApiContext()
  const [state, setState] = useState({
    reload: false,
    surveys: [] as LoadSurveyList.Model[],
    error: ''
  })
  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then((surveys) => {
        setState({ ...state, surveys })
      })
      .catch((error) => {
        if (error instanceof AccessDeniedError) {
          setCurrentAccount(undefined)
          navigate('/login')
          return
        }
        setState({ ...state, error: error.message })
      })
  }, [state.reload])
  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <SurveyListContext.Provider value={{ state, setState }}>
          {state.error ? <Error /> : <SurveyListItem />}
        </SurveyListContext.Provider>
      </div>
      <Footer />
    </div>
  )
}

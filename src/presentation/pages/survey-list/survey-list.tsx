import { type LoadSurveyList } from '@/domain/usecases'
import { Error, Footer, Header } from '@/presentation/components'
import { useErrorHandler } from '@/presentation/hooks'
import { SurveyListItem } from '@/presentation/pages/survey-list/components'
import React, { useEffect, useState } from 'react'
import Styles from './survey-list-styles.scss'

type Props = {
  loadSurveyList?: LoadSurveyList
}

export const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const handlerError = useErrorHandler((error) => {
    setState({ ...state, error: error.message })
  })
  const [state, setState] = useState({
    reload: false,
    surveys: [] as LoadSurveyList.Model[],
    error: ''
  })

  const handleReload = (): void => {
    setState((old) => ({ error: '', surveys: [], reload: !old.reload }))
  }

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then((surveys) => {
        setState({ ...state, surveys })
      })
      .catch(handlerError)
  }, [state.reload])
  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        {state.error ? (
          <Error error={state.error} reload={handleReload} />
        ) : (
          <SurveyListItem surveys={state.surveys} />
        )}
      </div>
      <Footer />
    </div>
  )
}

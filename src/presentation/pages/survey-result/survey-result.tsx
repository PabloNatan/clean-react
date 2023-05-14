import { type LoadSurveyResult } from '@/domain/usecases'
import { Error, Footer, Header, Loading } from '@/presentation/components'
import { useErrorHandler } from '@/presentation/hooks'
import React, { useEffect, useState } from 'react'
import { Result } from './components'
import Styles from './survey-result-styles.scss'

type Props = {
  loadSurveyResult: LoadSurveyResult
}

export const SurveyResult: React.FC<Props> = ({ loadSurveyResult }: Props) => {
  const handlerError = useErrorHandler((error) => {
    setState({ ...state, surveyResult: null, error: error.message })
  })
  const [state, setState] = useState({
    isLoading: false,
    reload: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Model
  })

  const handleReload = (): void => {
    setState((old) => ({
      ...old,
      error: '',
      surveyResult: null,
      reload: !old.reload
    }))
  }

  useEffect(() => {
    loadSurveyResult
      .load()
      .then((surveyResult) => {
        setState((old) => ({ ...old, surveyResult, isLoading: false }))
      })
      .catch(handlerError)
  }, [state.reload])

  return (
    <div className={Styles.surveyResultWrap}>
      <Header />
      <div className={Styles.contentWrap} data-testid="survey-result">
        {state.surveyResult && <Result surveyResult={state.surveyResult} />}
        {state.isLoading && <Loading />}
        {state.error && <Error error={state.error} reload={handleReload} />}
      </div>
      <Footer />
    </div>
  )
}

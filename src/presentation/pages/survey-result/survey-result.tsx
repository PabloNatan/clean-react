import { type SaveSurveyResult, type LoadSurveyResult } from '@/domain/usecases'
import { Error, Footer, Header, Loading } from '@/presentation/components'
import { useErrorHandler } from '@/presentation/hooks'
import React, { useEffect, useState } from 'react'
import { Result, SurveyResultContext } from './components'
import Styles from './survey-result-styles.scss'

type Props = {
  loadSurveyResult: LoadSurveyResult
  saveSurveyResult: SaveSurveyResult
}

export const SurveyResult: React.FC<Props> = ({
  loadSurveyResult,
  saveSurveyResult
}: Props) => {
  const handlerError = useErrorHandler((error) => {
    setState((old) => ({
      ...old,
      surveyResult: null,
      isLoading: null,
      error: error.message
    }))
  })
  const [state, setState] = useState({
    isLoading: false,
    reload: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Model
  })
  const onAnswer = (answer: string): void => {
    setState((old) => ({ ...old, isLoading: true, surveyResult: null }))
    saveSurveyResult
      .save({ answer })
      .then((surveyResult) => {
        setState((old) => ({ ...old, surveyResult, isLoading: false }))
      })
      .catch(handlerError)
  }
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
      <SurveyResultContext.Provider value={{ onAnswer }}>
        <div className={Styles.contentWrap} data-testid="survey-result">
          {state.surveyResult && <Result surveyResult={state.surveyResult} />}
          {state.isLoading && <Loading />}
          {state.error && <Error error={state.error} reload={handleReload} />}
        </div>
      </SurveyResultContext.Provider>
      <Footer />
    </div>
  )
}

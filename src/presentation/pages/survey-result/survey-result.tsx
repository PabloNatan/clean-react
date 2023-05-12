import { type LoadSurveyResult } from '@/domain/usecases'
import {
  Calendar,
  Error,
  Footer,
  Header,
  Loading
} from '@/presentation/components'
import React, { useEffect, useState } from 'react'
import FlipMove from 'react-flip-move'
import Styles from './survey-result-styles.scss'

type Props = {
  loadSurveyResult: LoadSurveyResult
}

export const SurveyResult: React.FC<Props> = ({ loadSurveyResult }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Model
  })

  useEffect(() => {
    loadSurveyResult
      .load()
      .then((surveyResult) => {
        setState((old) => ({ ...old, surveyResult }))
      })
      .catch((error) => {
        setState((old) => ({ ...old, error: error.message }))
      })
  }, [])

  return (
    <div className={Styles.surveyResultWrap}>
      <Header />
      <div className={Styles.contentWrap} data-testid="survey-result">
        {state.surveyResult && (
          <>
            <hgroup>
              <Calendar
                date={state.surveyResult.date}
                className={Styles.calendarWrap}
              />
              <h2>{state.surveyResult.question}</h2>
            </hgroup>
            <FlipMove className={Styles.answerList}>
              {state.surveyResult.answers.map((answer, index) => (
                <li
                  className={
                    answer.isCurrenctAccountAnswer ? Styles.active : ''
                  }
                  key={index}
                >
                  {answer.image && <img src={answer.image} />}
                  <span className={Styles.answer} data-testid="answer">
                    {answer.answer}
                  </span>
                  <span className={Styles.percent} data-testid="percent">
                    {answer.percent}%
                  </span>
                </li>
              ))}
            </FlipMove>
            <button>Voltar</button>
          </>
        )}
        {state.isLoading && <Loading />}
        {state.error && <Error error={state.error} reload={() => {}} />}
      </div>
      <Footer />
    </div>
  )
}

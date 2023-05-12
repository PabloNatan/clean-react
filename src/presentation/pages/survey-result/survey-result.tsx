import {
  Calendar,
  Error,
  Footer,
  Header,
  Loading
} from '@/presentation/components'
import React, { useState } from 'react'
import FlipMove from 'react-flip-move'
import { reactIcon } from './react-icon'
import Styles from './survey-result-styles.scss'
import { type LoadSurveyResult } from '@/domain/usecases'

export const SurveyResult: React.FC = () => {
  const [state] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Model
  })
  return (
    <div className={Styles.surveyResultWrap}>
      <Header />
      <div className={Styles.contentWrap} data-testid="survey-result">
        {state.surveyResult && (
          <>
            <hgroup>
              <Calendar date={new Date()} className={Styles.calendarWrap} />
              <h2>Qual é seu framework web favorito?</h2>
            </hgroup>
            <FlipMove className={Styles.answerList}>
              <li className={Styles.active}>
                <img src={reactIcon} />
                <span className={Styles.answer}>ReatJS</span>
                <span className={Styles.percent}>50%</span>
              </li>
              <li>
                <img src={reactIcon} />
                <span className={Styles.answer}>ReatJS</span>
                <span className={Styles.percent}>50%</span>
              </li>
              <li>
                <img src={reactIcon} />
                <span className={Styles.answer}>ReatJS</span>
                <span className={Styles.percent}>50%</span>
              </li>
            </FlipMove>
            <button>Voltar</button>
            {state.isLoading && <Loading />}
            {state.error && <Error error={state.error} reload={() => {}} />}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

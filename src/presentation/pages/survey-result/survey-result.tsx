import { Calendar, Footer, Header, Loading } from '@/presentation/components'
import React from 'react'
import FlipMove from 'react-flip-move'
import { reactIcon } from './react-icon'
import Styles from './survey-result-styles.scss'

export const SurveyResult: React.FC = () => {
  return (
    <div className={Styles.surveyResultWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        {false && (
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
            {false && <Loading />}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

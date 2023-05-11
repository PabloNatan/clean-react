import { Footer, Header, Spinner } from '@/presentation/components'
import React from 'react'
import FlipMove from 'react-flip-move'
import { reactIcon } from './react-icon'
import Styles from './survey-result-styles.scss'

export const SurveyResult: React.FC = () => {
  return (
    <div className={Styles.surveyResultWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Qual é seu framework web favorito?</h2>
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
        <div className={Styles.loadingWrap}>
          <div className={Styles.loading}>
            <span>Aguarde...</span>
            <Spinner isNegative />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

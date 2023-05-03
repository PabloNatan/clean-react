import React from 'react'
import Styles from './survey-list-styles.scss'
import { Footer, Header, Icon } from '@/presentation/components'

export const SurveyList: React.FC = () => {
  return (
    <div className={Styles.surveyListWrap}>
      <Header />

      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul>
          <li>
            <div className={Styles.surveyContent}>
              <Icon iconName="thumbUp" className={Styles.iconWrap} />
              <time>
                <span className={Styles.day}>22</span>
                <span className={Styles.month}>03</span>
                <span className={Styles.year}>2020</span>
              </time>
              <p>Qual é seu framework web favorito?</p>
            </div>
            <footer>Ver Reseultado</footer>
          </li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>

      <Footer />
    </div>
  )
}

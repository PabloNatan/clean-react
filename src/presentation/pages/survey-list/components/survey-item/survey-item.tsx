import { Icon } from '@/presentation/components'
import React from 'react'

import Styles from './survey-item-styles.scss'

export const SurveyItem: React.FC = () => {
  return (
    <li className={Styles.surveyItemWrap}>
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
  )
}

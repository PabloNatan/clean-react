import { Icon } from '@/presentation/components'
import React from 'react'

import Styles from './survey-item-styles.scss'
import { type SurveyModel } from '@/domain/models'

type Props = {
  survey: SurveyModel
}

export const SurveyItem: React.FC<Props> = ({ survey }: Props) => {
  return (
    <li className={Styles.surveyItemWrap}>
      <div className={Styles.surveyContent}>
        <Icon
          iconName={survey.didAnswer ? 'thumbUp' : 'thumbDown'}
          className={Styles.iconWrap}
        />
        <time>
          <span className={Styles.day} data-testid="day">
            {survey.date.getDate().toString().padStart(2, '0')}
          </span>
          <span className={Styles.month} data-testid="month">
            {survey.date
              .toLocaleString('pt-BR', { month: 'short' })
              .replaceAll('.', '')}
          </span>
          <span className={Styles.year} data-testid="year">
            {survey.date.getFullYear()}
          </span>
        </time>
        <p role="paragraph">{survey.question}</p>
      </div>
      <footer>Ver Reseultado</footer>
    </li>
  )
}

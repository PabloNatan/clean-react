import React from 'react'
import { Icon } from '@/presentation/components'
import Styles from './item-styles.scss'
import { type LoadSurveyList } from '@/domain/usecases'

type Props = {
  survey: LoadSurveyList.Model
}

export const SurveyItem: React.FC<Props> = ({ survey }: Props) => {
  return (
    <li className={Styles.surveyItemWrap} aria-label="survey">
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

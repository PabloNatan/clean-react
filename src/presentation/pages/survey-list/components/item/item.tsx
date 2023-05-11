import React from 'react'
import { Calendar, Icon } from '@/presentation/components'
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
        <Calendar date={survey.date} className={Styles.calendarWrap} />
        <p role="paragraph">{survey.question}</p>
      </div>
      <footer>Ver Reseultado</footer>
    </li>
  )
}

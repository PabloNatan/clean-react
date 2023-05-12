import { type LoadSurveyList } from '@/domain/usecases'
import {
  SurveyItem,
  SurveyItemEmpty
} from '@/presentation/pages/survey-list/components'
import React from 'react'
import Styles from './list-styles.scss'

type Props = {
  surveys: LoadSurveyList.Model[]
}

export const SurveyListItem: React.FC<Props> = ({ surveys }: Props) => {
  return (
    <ul className={Styles.listWrap}>
      {surveys.length > 0 ? (
        surveys.map((survey) => <SurveyItem key={survey.id} survey={survey} />)
      ) : (
        <SurveyItemEmpty />
      )}
    </ul>
  )
}

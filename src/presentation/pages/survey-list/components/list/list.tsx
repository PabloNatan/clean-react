import {
  SurveyItem,
  SurveyItemEmpty,
  useSurveyListContext
} from '@/presentation/pages/survey-list/components'
import React from 'react'
import Styles from './list-styles.scss'

export const SurveyListItem: React.FC = () => {
  const { state } = useSurveyListContext()
  return (
    <ul className={Styles.listWrap}>
      {state.surveys.length > 0 ? (
        state.surveys.map((survey) => (
          <SurveyItem key={survey.id} survey={survey} />
        ))
      ) : (
        <SurveyItemEmpty />
      )}
    </ul>
  )
}

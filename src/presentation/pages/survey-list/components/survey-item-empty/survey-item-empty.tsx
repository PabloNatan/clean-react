import React from 'react'

import Styles from './survey-item-empty-styles.scss'

export const SurveyItemEmpty: React.FC = () => {
  return (
    <>
      <li className={Styles.surveyItemEmpty} />
      <li className={Styles.surveyItemEmpty} />
      <li className={Styles.surveyItemEmpty} />
      <li className={Styles.surveyItemEmpty} />
    </>
  )
}

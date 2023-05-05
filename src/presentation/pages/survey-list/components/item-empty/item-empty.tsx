import React from 'react'
import Styles from './item-empty-styles.scss'

export const SurveyItemEmpty: React.FC = () => {
  return (
    <>
      {Array.from({ length: 4 }, (_, idx) => idx).map((i) => (
        <li
          className={Styles.surveyItemEmpty}
          key={String(i)}
          aria-label="survey-empty"
        />
      ))}
    </>
  )
}

import React from 'react'
import { useSurveyListContext } from '@/presentation/pages/survey-list/components'
import Styles from './error-styles.scss'

export const Error: React.FC = () => {
  const { state } = useSurveyListContext()
  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      <span>{state.error}</span>
      <button>Recarregar</button>
    </div>
  )
}

import React from 'react'
import { useSurveyListContext } from '@/presentation/pages/survey-list/components'
import Styles from './error-styles.scss'

export const Error: React.FC = () => {
  const { state, setState } = useSurveyListContext()
  const reload = (): void => {
    setState({ error: '', surveys: [], reload: !state.reload })
  }
  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      <span>{state.error}</span>
      <button type="button" onClick={reload}>
        Tentar Novamente
      </button>
    </div>
  )
}

import React, { useContext } from 'react'
import Styles from './form-status.styles.scss'
import { Spinner } from '../spinner'
import { FormContext } from '@/presentation/contexts/form/form-context'

export const FormStatus: React.FC = () => {
  const { state } = useContext(FormContext)
  return (
    <div
      className={Styles.errorWrapper}
      role="status"
      aria-label="request-feedback"
    >
      {state.isLoading && (
        <Spinner className={Styles.spinner} aria-label="spinner" />
      )}
      {state.mainError && (
        <span className={Styles.error} aria-label="error-message">
          {state.mainError}
        </span>
      )}
    </div>
  )
}

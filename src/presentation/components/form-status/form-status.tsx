import React, { useContext } from 'react'
import Styles from './form-status.styles.scss'
import { Spinner } from '../spinner'
import { FormContext } from '@/presentation/contexts/form/form-context'

export const FormStatus: React.FC = () => {
  const { isLoading, errorMessage } = useContext(FormContext)
  return (
    <div className={Styles.errorWrapper} role="status">
      {isLoading && <Spinner className={Styles.spinner} aria-label="spinner" />}
      {errorMessage && (
        <span className={Styles.error} aria-label="error-message">
          {errorMessage}
        </span>
      )}
    </div>
  )
}

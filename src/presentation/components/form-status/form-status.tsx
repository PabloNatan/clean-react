import React from 'react'
import Styles from './form-status.styles.scss'
import { Spinner } from '../spinner'

export const FormStatus: React.FC = () => {
  return (
    <div className={Styles.errorWrapper}>
      <Spinner className={Styles.spinner} />
      <span className={Styles.error}>Erro</span>
    </div>
  )
}

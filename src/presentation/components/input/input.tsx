import React, { useContext, type InputHTMLAttributes } from 'react'
import Styles from './input.styles.scss'
import { FormContext } from '@/presentation/contexts/form/form-context'

type Props = InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<Props> = (props) => {
  const { errorState } = useContext(FormContext)
  const error = errorState[props.name]

  const getStatus = (): string => {
    return 'error'
  }

  const getTitle = (): string => {
    return error
  }

  return (
    <div className={Styles.inputWrapper}>
      <input autoComplete="off" {...props} />
      <div
        title={getTitle()}
        className={[Styles.inputIcon, getStatus()].join(' ')}
        aria-label={`status-${props.name}`}
        role="status"
      />
    </div>
  )
}

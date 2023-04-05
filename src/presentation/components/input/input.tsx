import React, { useContext, type InputHTMLAttributes } from 'react'
import Styles from './input.styles.scss'
import { FormContext } from '@/presentation/contexts/form/form-context'

type Props = InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<Props> = (props) => {
  const { state, setState } = useContext(FormContext)
  const error = state[`${props.name}Error`]

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setState((oldState) => ({
      ...oldState,
      [event.target.name]: event.target.value
    }))
  }

  const getStatus = (): string => {
    return error ? 'error' : 'sucess'
  }

  const getTitle = (): string => {
    return error || 'Tudo certo!'
  }

  return (
    <div className={Styles.inputWrapper}>
      <input
        {...props}
        autoComplete="off"
        aria-label={props.name}
        onChange={handleChange}
      />
      <div
        title={getTitle()}
        className={[Styles.inputIcon, getStatus()].join(' ')}
        aria-label={`status-${props.name}`}
        role="status"
      />
    </div>
  )
}

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

  return (
    <div className={Styles.inputWrapper}>
      <input
        {...props}
        placeholder=" "
        autoComplete="off"
        aria-label={props.name}
        onChange={handleChange}
        id={props.name}
      />
      <label htmlFor={props.name}>{props.placeholder}</label>
      <div
        title={error || 'Tudo certo!'}
        className={[Styles.inputIcon, error ? 'error' : 'success'].join(' ')}
        aria-label={`status-${props.name}`}
        role="status"
      />
    </div>
  )
}

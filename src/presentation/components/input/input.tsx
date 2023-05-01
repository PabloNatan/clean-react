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
    <div
      className={Styles.inputWrapper}
      data-status={error ? 'invalid' : 'valid'}
      aria-label={`${props.name}-wrap`}
    >
      <input
        {...props}
        title={error}
        placeholder=" "
        autoComplete="off"
        aria-label={props.name}
        onChange={handleChange}
        id={props.name}
      />
      <label
        title={error}
        htmlFor={props.name}
        aria-label={`${props.name}-label`}
      >
        {props.placeholder}
      </label>
    </div>
  )
}

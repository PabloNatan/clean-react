import React, { type InputHTMLAttributes } from 'react'
import Styles from './input.styles.scss'

type Props = InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<Props> = (props) => {
  return (
    <div className={Styles.inputWrapper}>
      <input {...props} />
      <div className={Styles.inputIcon} />
    </div>
  )
}

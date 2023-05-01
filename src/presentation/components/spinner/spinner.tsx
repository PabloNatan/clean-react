import React from 'react'
import Styles from './spinner.styles.scss'

type Props = React.HTMLAttributes<HTMLElement>

export const Spinner: React.FC<Props> = ({ className, ...rest }: Props) => {
  const spinnerClassName = [Styles.spinner]
  if (className) {
    spinnerClassName.push(className)
  }
  return (
    <div {...rest} className={spinnerClassName.join(' ')} aria-label="spinner">
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}

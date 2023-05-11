import React from 'react'
import Styles from './spinner.styles.scss'

type Props = React.HTMLAttributes<HTMLElement> & {
  isNegative?: boolean
}

export const Spinner: React.FC<Props> = ({
  className,
  isNegative,
  ...rest
}: Props) => {
  const spinnerClassName = [Styles.spinner]
  if (className) {
    spinnerClassName.push(className)
  }

  if (isNegative) {
    spinnerClassName.push(Styles.negative)
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

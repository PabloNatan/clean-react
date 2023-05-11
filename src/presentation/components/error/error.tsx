import React from 'react'
import Styles from './error-styles.scss'

type Props = {
  error: string
  reload: () => void
}

export const Error: React.FC<Props> = ({ error, reload }: Props) => {
  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      <span>{error}</span>
      <button type="button" onClick={reload}>
        Tentar Novamente
      </button>
    </div>
  )
}

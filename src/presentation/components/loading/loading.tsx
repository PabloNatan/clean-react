import React from 'react'
import { Spinner } from '@/presentation/components'
import Styles from './loading-styles.scss'

export const Loading: React.FC = () => {
  return (
    <div className={Styles.loadingWrap} data-testid="loading-wrap">
      <div className={Styles.loading}>
        <span>Aguarde...</span>
        <Spinner isNegative />
      </div>
    </div>
  )
}

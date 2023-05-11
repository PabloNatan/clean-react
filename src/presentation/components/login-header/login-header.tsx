import React, { memo } from 'react'
import Styles from './login-header.styles.scss'
import { Logo } from '@/presentation/components'

const HeaderComponent: React.FC = () => {
  return (
    <header className={Styles.headerWrap}>
      <Logo />
      <h1>4Dev - Enquetes para programadores</h1>
    </header>
  )
}

export const LoginHeader = memo(HeaderComponent)

import Logo from '@/presentation/assets/logo.svg'
import React, { memo } from 'react'
import Styles from './login-header.styles.scss'

const HeaderComponent: React.FC = () => {
  return (
    <header className={Styles.header}>
      <img src={Logo} alt="o número 4 colocado na letra D" />
      <h1>4Dev - Enquetes para programadores</h1>
    </header>
  )
}

export const LoginHeader = memo(HeaderComponent)

import React, { memo } from 'react'
import Styles from './header-styles.scss'
import { Logo } from '../logo'

const HeaderComponent: React.FC = () => {
  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span>Pablo</span>
          <a href="#">Sair</a>
        </div>
      </div>
    </header>
  )
}

export const Header = memo(HeaderComponent)

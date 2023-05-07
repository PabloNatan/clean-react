import { useApiContext } from '@/presentation/contexts'
import { useLogout } from '@/presentation/hooks'
import React, { memo } from 'react'
import { Logo } from '../logo'
import Styles from './header-styles.scss'

const HeaderComponent: React.FC = () => {
  const { getCurrentAccount } = useApiContext()
  const logout = useLogout()
  const handleLogout = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ): void => {
    event.preventDefault()
    logout()
  }
  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span aria-label="username">{getCurrentAccount().name}</span>
          <a href="#" onClick={handleLogout}>
            Sair
          </a>
        </div>
      </div>
    </header>
  )
}

export const Header = memo(HeaderComponent)

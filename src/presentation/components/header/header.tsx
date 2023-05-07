import { useApiContext } from '@/presentation/contexts'
import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../logo'
import Styles from './header-styles.scss'

const HeaderComponent: React.FC = () => {
  const navigate = useNavigate()
  const { setCurrentAccount, getCurrentAccount } = useApiContext()
  const logout = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ): void => {
    event.preventDefault()
    setCurrentAccount(undefined)
    navigate('/login')
  }
  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span aria-label="username">{getCurrentAccount().name}</span>
          <a href="#" onClick={logout}>
            Sair
          </a>
        </div>
      </div>
    </header>
  )
}

export const Header = memo(HeaderComponent)

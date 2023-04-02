import React from 'react'
import Styles from './login-styles.scss'
import Logo from '../../assets/logo.svg'
import { Spinner } from '@/presentation/components/spinner'

export const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <header className={Styles.header}>
        <img src={Logo} alt="o número 4 colocado na letra D" />
        <h1>4Dev - Enquetes para programadores</h1>
      </header>

      <form className={Styles.form}>
        <h2>Login</h2>
        <div className={Styles.inputWrapper}>
          <input type="email" name="email" placeholder="Digite seu e-mail" />
          <div className={Styles.inputIcon} />
        </div>
        <div className={Styles.inputWrapper}>
          <input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <div className={Styles.inputIcon}></div>
        </div>
        <button type="submit">Entrar</button>
        <span className={Styles.signUpLink}>Criar contar</span>

        <div className={Styles.errorWrapper}>
          <Spinner className={Styles.spinner} />
          <span className={Styles.error}>Erro</span>
        </div>
      </form>
      <footer className={Styles.footer} />
    </div>
  )
}

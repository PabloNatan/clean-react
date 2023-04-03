import React from 'react'
import Styles from './login-styles.scss'

import { Spinner } from '@/presentation/components/spinner'
import { LoginHeader } from '@/presentation/components/login-header'
import { Footer } from '@/presentation/components/footer'
import { Input } from '@/presentation/components/input/input'

export const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <LoginHeader />
      <form className={Styles.form}>
        <h2>Login</h2>

        <Input type="email" name="email" placeholder="Digite seu e-mail" />
        <Input type="password" name="password" placeholder="Digite sua senha" />

        <button type="submit">Entrar</button>
        <span className={Styles.signUpLink}>Criar contar</span>

        <div className={Styles.errorWrapper}>
          <Spinner className={Styles.spinner} />
          <span className={Styles.error}>Erro</span>
        </div>
      </form>
      <Footer />
    </div>
  )
}

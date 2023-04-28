import {
  Footer,
  FormStatus,
  Input,
  LoginHeader
} from '@/presentation/components'
import { FormContext } from '@/presentation/contexts/form/form-context'
import React from 'react'
import { Link } from 'react-router-dom'
import Styles from './signup-styles.scss'

export const SignUp: React.FC = () => {
  return (
    <div className={Styles.login}>
      <LoginHeader />
      <FormContext.Provider value={{ state: {} }}>
        <form className={Styles.form} role="form">
          <h2>Criar Conta</h2>
          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            role="password"
            placeholder="Digite sua senha"
          />
          <Input
            type="password"
            name="passwordConfirmation"
            role="password"
            placeholder="Digite sua senha"
          />
          <button type="submit">Entrar</button>
          <Link to="/login" className={Styles.signUpLink}>
            Voltar Para Login
          </Link>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer />
    </div>
  )
}

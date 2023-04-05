import React, { useEffect, useState } from 'react'
import Styles from './login-styles.scss'
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader
} from '@/presentation/components'
import { FormContext } from '@/presentation/contexts/form/form-context'
import { type Validation } from '@/presentation/protocols/validation'
import { type Authentication } from '@/domain/usecases'

type Props = {
  validation: Validation
  authentication: Authentication
}

export const Login: React.FC<Props> = ({
  validation,
  authentication
}: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })

  useEffect(() => {
    setState((oldState) => ({
      ...oldState,
      emailError: validation.validate('email', oldState.email)
    }))
  }, [state.email])

  useEffect(() => {
    setState((oldState) => ({
      ...oldState,
      passwordError: validation.validate('password', oldState.password)
    }))
  }, [state.password])

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()
    setState((oldState) => ({ ...oldState, isLoading: true }))
    await authentication.auth({ email: state.email, password: state.password })
  }

  const isFormInvalid = !!state.emailError || !!state.passwordError
  return (
    <div className={Styles.login}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            role="password"
            placeholder="Digite sua senha"
          />
          <button type="submit" disabled={isFormInvalid}>
            Entrar
          </button>
          <span className={Styles.signUpLink}>Criar contar</span>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer />
    </div>
  )
}
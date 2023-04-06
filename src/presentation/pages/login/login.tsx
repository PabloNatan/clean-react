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
import { Link } from 'react-router-dom'

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

  const isFormInvalid =
    !!state.emailError ||
    !!state.passwordError ||
    !state.email ||
    !state.password

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
    console.log('CALL ME')
    event.preventDefault()
    try {
      if (state.isLoading || isFormInvalid) {
        return
      }
      setState((oldState) => ({ ...oldState, isLoading: true }))
      const acccount = await authentication.auth({
        email: state.email,
        password: state.password
      })

      localStorage.setItem('accessToken', acccount.accessToken)
    } catch (error) {
      setState((oldState) => ({
        ...oldState,
        mainError: error.message,
        isLoading: false
      }))
    }
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form className={Styles.form} onSubmit={handleSubmit} role="form">
          <h2>Login</h2>
          <Input
            value={state.email}
            type="email"
            name="email"
            placeholder="Digite seu e-mail"
          />
          <Input
            value={state.password}
            type="password"
            name="password"
            role="password"
            placeholder="Digite sua senha"
          />
          <button type="submit" disabled={isFormInvalid}>
            Entrar
          </button>
          <Link to="/signup" className={Styles.signUpLink}>
            Criar contar
          </Link>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer />
    </div>
  )
}

import { type Authentication } from '@/domain/usecases'
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
  SubmitButton
} from '@/presentation/components'
import { useApiContext } from '@/presentation/contexts'
import { FormContext } from '@/presentation/contexts/form/form-context'
import { type Validation } from '@/presentation/protocols/validation'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Styles from './login-styles.scss'

type Props = {
  validation: Validation
  authentication: Authentication
}

export const Login: React.FC<Props> = ({
  validation,
  authentication
}: Props) => {
  const apiContext = useApiContext()
  const navigate = useNavigate()
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: '',
    isFormValid: false
  })

  const validate = (oldState: typeof state, field: string): typeof state => {
    const formData = { email: oldState.email, password: oldState.password }
    const fieldError = validation.validate(field, formData)
    const { emailError, passwordError } = oldState
    return {
      ...oldState,
      [`${field}Error`]: fieldError,
      isFormValid: !fieldError && !emailError && !passwordError
    }
  }

  useEffect(() => {
    setState((oldState) => validate(oldState, 'email'))
  }, [state.email])

  useEffect(() => {
    setState((oldState) => validate(oldState, 'password'))
  }, [state.password])

  useEffect(() => {
    setState((old) => ({
      ...old,
      isFormValid: !old.emailError && !old.passwordError
    }))
  }, [state.emailError, state.passwordError])

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()
    try {
      if (state.isLoading || !state.isFormValid) {
        return
      }
      setState((oldState) => ({ ...oldState, isLoading: true }))
      const acccount = await authentication.auth({
        email: state.email,
        password: state.password
      })
      apiContext.setCurrentAccount(acccount)
      navigate('/')
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
          <SubmitButton text="Entrar" />
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

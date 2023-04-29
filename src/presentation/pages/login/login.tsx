import { type SaveAccessToken, type Authentication } from '@/domain/usecases'
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
  SubmitButton
} from '@/presentation/components'
import { FormContext } from '@/presentation/contexts/form/form-context'
import { type Validation } from '@/presentation/protocols/validation'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Styles from './login-styles.scss'

type Props = {
  validation: Validation
  authentication: Authentication
  saveAccessToken: SaveAccessToken
}

export const Login: React.FC<Props> = ({
  validation,
  authentication,
  saveAccessToken
}: Props) => {
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

  useEffect(() => {
    setState((oldState) => {
      const emailError = validation.validate('email', oldState.email)
      const passwordError = validation.validate('password', oldState.password)
      return {
        ...oldState,
        emailError,
        passwordError,
        isFormValid: !emailError && !passwordError
      }
    })
  }, [state.email, state.password])

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
      await saveAccessToken.save(acccount.accessToken)
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

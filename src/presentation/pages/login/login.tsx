import {
  type UpdateCurrentAccount,
  type Authentication
} from '@/domain/usecases'
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
  updateCurrenctAccount: UpdateCurrentAccount
}

export const Login: React.FC<Props> = ({
  validation,
  authentication,
  updateCurrenctAccount
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
      const { email, password } = oldState
      const formData = { email, password }
      const emailError = validation.validate('email', formData)
      const passwordError = validation.validate('password', formData)
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
      await updateCurrenctAccount.save(acccount)
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

import { type AddAccount } from '@/domain/usecases'
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
import Styles from './signup-styles.scss'
import { useApiContext } from '@/presentation/contexts'

type Props = {
  validation: Validation
  addAccount: AddAccount
}

export const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
  const apiContext = useApiContext()
  const navigate = useNavigate()
  const [state, setState] = useState({
    email: '',
    name: '',
    password: '',
    passwordConfirmation: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmationError: '',
    isLoading: false,
    isFormValid: false,
    mainError: ''
  })

  const validate = (oldState: typeof state, field: string): typeof state => {
    const { email, password, name, passwordConfirmation } = oldState
    const formData = { email, password, name, passwordConfirmation }
    const fieldError = validation.validate(field, formData)
    const { emailError, passwordError, nameError, passwordConfirmationError } =
      oldState
    return {
      ...oldState,
      [`${field}Error`]: fieldError,
      isFormValid:
        !fieldError &&
        !emailError &&
        !passwordError &&
        !nameError &&
        !passwordConfirmationError
    }
  }

  useEffect(() => {
    setState((oldState) => validate(oldState, 'name'))
  }, [state.name])

  useEffect(() => {
    setState((oldState) => validate(oldState, 'email'))
  }, [state.email])

  useEffect(() => {
    setState((oldState) => validate(oldState, 'password'))
  }, [state.password])

  useEffect(() => {
    setState((oldState) => validate(oldState, 'passwordConfirmation'))
  }, [state.passwordConfirmation])

  useEffect(() => {
    setState((old) => ({
      ...old,
      isFormValid:
        !old.emailError &&
        !old.passwordError &&
        !old.nameError &&
        !old.passwordConfirmationError
    }))
  }, [
    state.emailError,
    state.passwordError,
    state.nameError,
    state.passwordConfirmationError
  ])

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()
    try {
      if (state.isLoading || !state.isFormValid) {
        return
      }
      setState((oldState) => ({
        ...oldState,
        isLoading: true
      }))
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation
      })
      apiContext.setCurrentAccount(account)
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
            role="passwordConfirmation"
            placeholder="Digite sua senha"
          />
          <SubmitButton text="Cadastrar" />
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

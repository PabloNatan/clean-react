import {
  Footer,
  FormStatus,
  Input,
  LoginHeader
} from '@/presentation/components'
import { FormContext } from '@/presentation/contexts/form/form-context'
import React, { useEffect, useState } from 'react'
import Styles from './signup-styles.scss'
import { type Validation } from '@/presentation/protocols/validation'
import { type AddAccount } from '@/domain/usecases'

type Props = {
  validation: Validation
  addAccount: AddAccount
}

export const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
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
    mainError: ''
  })

  useEffect(() => {
    setState((oldState) => ({
      ...oldState,
      nameError: validation.validate('name', oldState.name)
    }))
  }, [state.name])

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

  useEffect(() => {
    setState((oldState) => ({
      ...oldState,
      passwordConfirmationError: validation.validate(
        'passwordConfirmation',
        oldState.passwordConfirmation
      )
    }))
  }, [state.passwordConfirmation])

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()
    if (state.isLoading) {
      return
    }
    setState((oldState) => ({
      ...oldState,
      isLoading: true
    }))
    addAccount.add({
      name: state.name,
      email: state.email,
      password: state.password,
      passwordConfirmation: state.passwordConfirmation
    })
  }

  const isFormInvalid =
    !!state.nameError ||
    !!state.emailError ||
    !!state.passwordError ||
    !!state.passwordConfirmationError

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
          <button type="submit" disabled={isFormInvalid}>
            Entrar
          </button>
          <span className={Styles.signUpLink}>Voltar Para Login</span>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer />
    </div>
  )
}

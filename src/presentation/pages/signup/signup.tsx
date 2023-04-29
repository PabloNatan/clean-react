import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
  SubmitButton
} from '@/presentation/components'
import { FormContext } from '@/presentation/contexts/form/form-context'
import React, { useEffect, useState } from 'react'
import Styles from './signup-styles.scss'
import { type Validation } from '@/presentation/protocols/validation'
import { type SaveAccessToken, type AddAccount } from '@/domain/usecases'
import { Link, useNavigate } from 'react-router-dom'

type Props = {
  validation: Validation
  addAccount: AddAccount
  saveAccessToken: SaveAccessToken
}

export const SignUp: React.FC<Props> = ({
  validation,
  addAccount,
  saveAccessToken
}: Props) => {
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

  useEffect(() => {
    setState((oldState) => {
      const { name, email, password, passwordConfirmation } = oldState
      const formData = { name, email, password, passwordConfirmation }
      const nameError = validation.validate('name', formData)
      const emailError = validation.validate('email', formData)
      const passwordError = validation.validate('password', formData)
      const passwordConfirmationError = validation.validate(
        'passwordConfirmation',
        formData
      )

      return {
        ...oldState,
        nameError,
        emailError,
        passwordError,
        passwordConfirmationError,
        isFormValid:
          !nameError &&
          !emailError &&
          !passwordError &&
          !passwordConfirmationError
      }
    })
  }, [state.name, state.email, state.password, state.passwordConfirmation])

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
      await saveAccessToken.save(account.accessToken)
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

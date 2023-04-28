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

type Props = {
  validation: Validation
}

export const SignUp: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    email: '',
    isLoading: false,
    nameError: 'Campo obrigatório',
    emailError: '',
    passwordError: 'Campo obrigatório',
    passwordConfirmationError: 'Campo obrigatório',
    mainError: ''
  })

  useEffect(() => {
    setState((oldState) => ({
      ...oldState,
      emailError: validation.validate('email', oldState.email)
    }))
  }, [state.email])

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
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
            role="passwordConfirmation"
            placeholder="Digite sua senha"
          />
          <button type="submit" disabled>
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

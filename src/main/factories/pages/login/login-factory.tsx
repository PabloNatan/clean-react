import { makeRemoteAuthentication } from '@/main/factories/usecases'
import { Login } from '@/presentation/pages'
import React, { type ReactNode } from 'react'
import { makeLoginValidation } from './login-validation-factory'

type Props = {
  children?: ReactNode
}

export const makeLogin: React.FC<Props> = () => {
  return (
    <Login
      authentication={makeRemoteAuthentication()}
      validation={makeLoginValidation()}
    />
  )
}

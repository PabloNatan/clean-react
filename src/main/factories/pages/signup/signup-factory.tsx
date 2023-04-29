import { makeLocalSaveAccessToken } from '@/main/factories/usecases'
import { SignUp } from '@/presentation/pages'
import React, { type ReactNode } from 'react'
import { makeRemoteAddAccount } from '../../usecases/addAccount/add-account-factory'
import { makeSignUpValidation } from './signup-validation-factory'

type Props = {
  children?: ReactNode
}

export const makeSignUp: React.FC<Props> = () => {
  return (
    <SignUp
      addAccount={makeRemoteAddAccount()}
      validation={makeSignUpValidation()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  )
}

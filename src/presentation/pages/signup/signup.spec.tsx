import React from 'react'
import { faker } from '@faker-js/faker'

import { cleanup, render, type RenderResult } from '@testing-library/react'

import { SignUp } from '@/presentation/pages'
import { Helper, ValidationStub } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationStub
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationStub()
  validationSpy.errorMessage = params?.validationError
  const sut = render(<SignUp validation={validationSpy} />)
  return { sut, validationSpy }
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    const { errorMessage, spinner } = Helper.getFormStatusComponents()
    expect(spinner).not.toBeInTheDocument()
    expect(errorMessage).not.toBeInTheDocument()
    Helper.testButtonIsDisabled()
    Helper.testStatusForField('name', 'Campo obrigatório')
    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', 'Campo obrigatório')
    Helper.testStatusForField('passwordConfirmation', 'Campo obrigatório')
  })

  test('Should call Validation with correct email', async () => {
    const { validationSpy } = makeSut({ validationError: 'Campo obrigatório' })
    const email = faker.internet.email()
    await Helper.populateFieldAsync('email', 'textbox', email)
    expect(validationSpy.fieldName).toEqual('email')
    expect(validationSpy.fieldValue).toEqual(email)
  })

  test('Should show email error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    await Helper.populateFieldAsync('email')
    Helper.testStatusForField('email', validationError)
  })
})

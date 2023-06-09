import { faker } from '@faker-js/faker'
import {
  cleanup,
  render,
  screen,
  type ByRoleMatcher,
  type RenderResult
} from '@testing-library/react'
import user from '@testing-library/user-event'
import React from 'react'

import { EmailInUseError } from '@/domain/errors'
import { type AddAccount } from '@/domain/usecases'
import { ApiContext } from '@/presentation/contexts'
import { SignUp } from '@/presentation/pages'
import { Helper, ValidationStub } from '@/presentation/test'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { AddAccountSpy } from '@/domain/test'

const signUpFields = {
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
}

type SutTypes = {
  sut: RenderResult
  history: ReturnType<typeof createMemoryRouter>
  validationSpy: ValidationStub
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: (account: AddAccount.Model) => void
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationStub()
  validationSpy.errorMessage = params?.validationError
  const addAccountSpy = new AddAccountSpy()
  const setCurrentAccountMock = jest.fn()

  const element = (
    <SignUp validation={validationSpy} addAccount={addAccountSpy} />
  )
  const history = createMemoryRouter(
    [
      { path: '/signup', element },
      {
        path: '/login',
        element
      },
      {
        path: '/',
        element
      }
    ],
    {
      initialIndex: 0,
      initialEntries: ['/signup']
    }
  )

  const sut = render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <RouterProvider router={history} />
    </ApiContext.Provider>
  )
  return {
    sut,
    validationSpy,
    addAccountSpy,
    setCurrentAccountMock,
    history
  }
}

const simulateValidSubmitAsync = async (
  name = faker.name.fullName(),
  email = faker.internet.email(),
  password = faker.internet.password(),
  inputPasswordConfirmation?: string
): Promise<void> => {
  const passwordConfirmation = inputPasswordConfirmation || password
  await Helper.populateFieldAsync('name', 'textbox', name)
  await Helper.populateFieldAsync('email', 'textbox', email)
  await Helper.populateFieldAsync('password', 'password', password)
  await Helper.populateFieldAsync(
    'passwordConfirmation',
    'passwordConfirmation',
    passwordConfirmation
  )
  const submitButton = screen.getByRole('button')
  await user.click(submitButton)
}

const validateIfShowFieldError = async (
  fieldName: keyof typeof signUpFields,
  role: ByRoleMatcher = 'textbox'
): Promise<void> => {
  const validationError = faker.random.words()
  makeSut({ validationError })
  await Helper.populateFieldAsync(fieldName, role)
  Helper.testStatusForField(fieldName, validationError)
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    const formStatus = screen.getByRole('status', { name: /request-feedback/i })
    expect(formStatus).toBeEmptyDOMElement()
    expect(screen.getByRole('button')).toBeDisabled()
    Object.keys(signUpFields).forEach((field) => {
      Helper.testStatusForField(field, validationError)
    })
  })

  test('Should show name error if Validation fails', async () => {
    await validateIfShowFieldError('name')
  })

  test('Should show email error if Validation fails', async () => {
    await validateIfShowFieldError('email')
  })

  test('Should show password error if Validation fails', async () => {
    await validateIfShowFieldError('password', 'password')
  })

  test('Should show passwordConfirmation error if Validation fails', async () => {
    await validateIfShowFieldError(
      'passwordConfirmation',
      'passwordConfirmation'
    )
  })

  test('Should show valid name state  if Validation succeeds', async () => {
    await Helper.validateFieldSucceds(makeSut, 'name')
  })

  test('Should show valid email state  if Validation succeeds', async () => {
    await Helper.validateFieldSucceds(makeSut, 'email')
  })

  test('Should show valid password state  if Validation succeeds', async () => {
    await Helper.validateFieldSucceds(makeSut, 'password', 'password')
  })

  test('Should show valid passwordConfirmation state  if Validation succeeds', async () => {
    await Helper.validateFieldSucceds(
      makeSut,
      'passwordConfirmation',
      'passwordConfirmation'
    )
  })

  test('Should enable submit button if form is valid', async () => {
    makeSut()
    const submitButton = screen.getByRole('button')
    await Helper.populateFieldAsync('name')
    await Helper.populateFieldAsync('email')
    await Helper.populateFieldAsync('password', 'password')
    await Helper.populateFieldAsync(
      'passwordConfirmation',
      'passwordConfirmation'
    )
    expect(submitButton).toBeEnabled()
  })

  test('Should show spinner on submit', async () => {
    makeSut()
    await simulateValidSubmitAsync()
    const { spinner } = Helper.getFormStatusComponents()
    expect(spinner).toBeInTheDocument()
  })

  test('Should call AddAccount with correct values', async () => {
    const { addAccountSpy } = makeSut()
    const name = faker.name.fullName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const passwordConfirmation = password
    await simulateValidSubmitAsync(name, email, password, passwordConfirmation)
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation
    })
  })

  test('should call Authentication only once', async () => {
    const { addAccountSpy } = makeSut()
    await simulateValidSubmitAsync()
    await simulateValidSubmitAsync()
    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('Should not call AddAccount if form is invalid', async () => {
    const validationError = faker.random.words()
    const { addAccountSpy } = makeSut({ validationError })
    await simulateValidSubmitAsync()
    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)
    await simulateValidSubmitAsync()
    const { errorMessage, spinner } = Helper.getFormStatusComponents()
    expect(spinner).not.toBeInTheDocument()
    expect(errorMessage.textContent).toBe(error.message)
  })

  test('Should call UpdateCurrentAccount on success', async () => {
    const { addAccountSpy, history, setCurrentAccountMock } = makeSut()
    await simulateValidSubmitAsync()
    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    expect(history.state.location.pathname).toBe('/')
  })

  test('Should present error if UpdateCurrentAccount fails', async () => {
    const { addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)
    await simulateValidSubmitAsync()
    const { errorMessage } = Helper.getFormStatusComponents()
    expect(errorMessage.textContent).toBe(error.message)
  })

  test('Should go to login page', async () => {
    const { history } = makeSut()
    const loginButton = screen.getByRole('link')
    await user.click(loginButton)
    expect(history.state.location.pathname).toBe('/login')
  })
})

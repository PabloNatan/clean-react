import faker from 'faker'
import React from 'react'

import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
  type RenderResult
} from '@testing-library/react'
import user from '@testing-library/user-event'
import 'jest-localstorage-mock'

import { InvalidCredentialsError } from '@/domain/errors'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { Login } from './login'

type SutTypes = {
  sut: RenderResult
  router: ReturnType<typeof createMemoryRouter>
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  validationSpy.errorMessage = params?.validationError

  const router = createMemoryRouter(
    [
      {
        path: '/login',
        element: (
          <Login
            validation={validationSpy}
            authentication={authenticationSpy}
          />
        )
      },
      { path: '/signup', element: <div>SingUp</div> }
    ],
    {
      initialIndex: 0,
      initialEntries: ['/login']
    }
  )

  const sut = render(<RouterProvider router={router} />)

  return { sut, router, validationSpy, authenticationSpy }
}

const populatePasswordFieldAsync = async (
  password = faker.internet.password()
): Promise<void> => {
  const passwordInput = screen.getByRole('password', { name: /password/i })
  await user.clear(passwordInput)
  await user.click(passwordInput)
  await user.keyboard(password)
}

const populateEmailFieldAsync = async (
  email = faker.internet.email()
): Promise<void> => {
  const emailInput = screen.getByRole('textbox', { name: /email/i })
  await user.clear(emailInput)
  await user.click(emailInput)
  await user.keyboard(email)
}

const simulateValidSubmitAsync = async (
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  await populateEmailFieldAsync(email)
  await populatePasswordFieldAsync(password)
  const submitButton = screen.getByRole('button')
  await user.click(submitButton)
}

const simulateStatusForField = (
  field: string,
  validationError?: string
): void => {
  const status = screen.getByRole('status', {
    name: new RegExp(`status-${field}`)
  })
  expect(status).toHaveClass(validationError ? 'error' : 'success')
  expect(status.title).toBe(validationError || 'Tudo certo!')
}

describe('Login Component', () => {
  afterEach(cleanup)

  beforeEach(() => {
    localStorage.clear()
  })

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    const formStatus = screen.getByRole('status', { name: /request-feedback/i })
    const spinner = within(formStatus).queryByLabelText('spinner')
    const errorMessage = within(formStatus).queryByLabelText('error-message')
    expect(spinner).not.toBeInTheDocument()
    expect(errorMessage).not.toBeInTheDocument()

    const submitButton = screen.getByRole('button')
    expect(submitButton).toBeDisabled()

    simulateStatusForField('email', validationError)
    simulateStatusForField('password', validationError)
  })

  test('Should call Validation with correct email', async () => {
    const { validationSpy } = makeSut()
    const email = faker.internet.email()
    await populateEmailFieldAsync(email)
    expect(validationSpy.fieldName).toEqual('email')
    expect(validationSpy.fieldValue).toEqual(email)
  })

  test('Should call Validation with correct password', async () => {
    const { validationSpy } = makeSut()
    const password = faker.internet.password()
    await populatePasswordFieldAsync(password)
    expect(validationSpy.fieldName).toEqual('password')
    expect(validationSpy.fieldValue).toEqual(password)
  })

  test('Should show email error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    await populateEmailFieldAsync()
    simulateStatusForField('email', validationError)
  })

  test('Should show password error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    await populatePasswordFieldAsync()
    simulateStatusForField('password', validationError)
  })

  test('Should show valid password state  if Validation succeeds', async () => {
    makeSut()
    await populatePasswordFieldAsync()
    simulateStatusForField('password')
  })

  test('Should show valid email state  if Validation succeeds', async () => {
    makeSut()
    await populateEmailFieldAsync()
    simulateStatusForField('email')
  })

  test('Should enable submit button if form is valid', async () => {
    makeSut()
    const submitButton = screen.getByRole('button')
    await populateEmailFieldAsync()
    await populatePasswordFieldAsync()
    expect(submitButton).toBeEnabled()
  })

  test('Should show spinner on submit', async () => {
    makeSut()
    await simulateValidSubmitAsync()
    const formStatus = screen.getByRole('status', { name: /request-feedback/i })
    const spinner = within(formStatus).queryByLabelText('spinner')
    expect(spinner).toBeInTheDocument()
  })

  test('Should call Authentication with correct values', async () => {
    const { authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmitAsync(email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('should call Authentication only once', async () => {
    const { authenticationSpy } = makeSut()
    await simulateValidSubmitAsync()
    const submitButton = screen.getByRole('button')
    await user.click(submitButton)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if password is not provided', async () => {
    const { authenticationSpy } = makeSut()
    await populateEmailFieldAsync()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should not call Authentication if email is not provided', async () => {
    const { authenticationSpy } = makeSut()
    await populatePasswordFieldAsync()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should not call Authentication if invalid email provided', async () => {
    const validationError = faker.random.words()
    const { authenticationSpy } = makeSut({ validationError })
    await populatePasswordFieldAsync()
    await populatePasswordFieldAsync()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()

    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    await simulateValidSubmitAsync()

    const formStatus = screen.getByRole('status', { name: /request-feedback/i })
    const spinner = within(formStatus).queryByLabelText('spinner')

    const errorMessage = await within(formStatus).findByLabelText(
      'error-message'
    )

    expect(spinner).not.toBeInTheDocument()
    expect(errorMessage.textContent).toBe(error.message)
  })

  test('Should add accessToken to localstorage on success', async () => {
    const { authenticationSpy } = makeSut()
    await simulateValidSubmitAsync()
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'accessToken',
      authenticationSpy.account.accessToken
    )
  })

  test.only('Should go to signup page', async () => {
    const { router } = makeSut()
    const registerButton = screen.getByRole('link')
    await user.click(registerButton)
    expect(router.state.location.pathname).toBe('/signup')
  })
})

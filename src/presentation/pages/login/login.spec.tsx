import { faker } from '@faker-js/faker'
import React from 'react'

import {
  AuthenticationSpy,
  Helper,
  UpdateCurrentAccountMock,
  ValidationStub
} from '@/presentation/test'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  type RenderResult
} from '@testing-library/react'
import user from '@testing-library/user-event'

import { InvalidCredentialsError } from '@/domain/errors'
import { Login } from '@/presentation/pages'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

type SutTypes = {
  sut: RenderResult
  history: ReturnType<typeof createMemoryRouter>
  validationStub: ValidationStub
  authenticationSpy: AuthenticationSpy
  updateCurrentAccountMock: UpdateCurrentAccountMock
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const updateCurrentAccountMock = new UpdateCurrentAccountMock()
  validationStub.errorMessage = params?.validationError

  const element = (
    <Login
      validation={validationStub}
      authentication={authenticationSpy}
      updateCurrenctAccount={updateCurrentAccountMock}
    />
  )

  const history = createMemoryRouter(
    [
      {
        path: '/login',
        element
      },
      { path: '/signup', element },
      {
        path: '/',
        element
      }
    ],
    {
      initialIndex: 0,
      initialEntries: ['/login']
    }
  )

  const sut = render(<RouterProvider router={history} />)

  return {
    sut,
    history,
    validationStub,
    authenticationSpy,
    updateCurrentAccountMock
  }
}

const simulateValidSubmitAsync = async (
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  await Helper.populateFieldAsync('email', 'textbox', email)
  await Helper.populateFieldAsync('password', 'password', password)
  const submitButton = screen.getByRole('button')
  await user.click(submitButton)
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

    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
  })

  test('Should show email error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    await Helper.populateFieldAsync('email')
    Helper.testStatusForField('email', validationError)
  })

  test('Should show password error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    await Helper.populateFieldAsync('password', 'password')
    Helper.testStatusForField('password', validationError)
  })

  test('Should show valid password state  if Validation succeeds', async () => {
    makeSut()
    await Helper.populateFieldAsync('password', 'password')
    Helper.testStatusForField('password')
  })

  test('Should show valid email state  if Validation succeeds', async () => {
    makeSut()
    await Helper.populateFieldAsync('email', 'textbox', faker.internet.email())
    Helper.testStatusForField('email')
  })

  test('Should enable submit button if form is valid', async () => {
    makeSut()
    const submitButton = screen.getByRole('button')
    await Helper.populateFieldAsync('email')
    await Helper.populateFieldAsync('password', 'password')
    expect(submitButton).toBeEnabled()
  })

  test('Should show spinner on submit', async () => {
    makeSut()
    await simulateValidSubmitAsync()
    const { spinner } = Helper.getFormStatusComponents()
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
    await simulateValidSubmitAsync()
    const submitButton = screen.queryByRole('button', { name: /signIn/i })
    await user.click(submitButton)

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if password is not provided', async () => {
    const { authenticationSpy } = makeSut({
      validationError: 'Password not provided'
    })
    await Helper.populateFieldAsync('email')
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should not call Authentication if email is not provided', async () => {
    const { authenticationSpy } = makeSut({
      validationError: 'Email not provided'
    })
    await Helper.populateFieldAsync('password', 'password')
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should not call Authentication if invalid email provided', async () => {
    const validationError = faker.random.words()
    const { authenticationSpy } = makeSut({ validationError })
    await Helper.populateFieldAsync('password', 'password')
    await Helper.populateFieldAsync('email')
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()

    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    await simulateValidSubmitAsync()

    const { errorMessage, spinner } = Helper.getFormStatusComponents()
    expect(spinner).not.toBeInTheDocument()
    expect(errorMessage.textContent).toBe(error.message)
  })

  test('Should call UpdateCurrentAccount on success', async () => {
    const { authenticationSpy, history, updateCurrentAccountMock } = makeSut()
    await simulateValidSubmitAsync()
    expect(updateCurrentAccountMock.account).toEqual(authenticationSpy.account)
    expect(history.state.location.pathname).toBe('/')
  })

  test('Should present error if UpdateCurrentAccount fails', async () => {
    const { updateCurrentAccountMock } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(updateCurrentAccountMock, 'save').mockRejectedValueOnce(error)
    await simulateValidSubmitAsync()
    const { errorMessage } = Helper.getFormStatusComponents()
    expect(errorMessage.textContent).toBe(error.message)
  })

  test('Should go to signup page', async () => {
    const { history } = makeSut()
    const registerButton = screen.getByRole('link')
    await user.click(registerButton)
    expect(history.state.location.pathname).toBe('/signup')
  })
})

import React from 'react'
import { ApiContext } from '@/presentation/contexts'
import { render, screen } from '@testing-library/react'
import { Header } from './header'
import user from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { type AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'

type SutTypes = {
  history: ReturnType<typeof createMemoryRouter>
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const setCurrentAccountMock = jest.fn()
  const history = createMemoryRouter(
    [
      {
        path: '/',
        element: <Header />
      },
      {
        path: '/login',
        element: <></>
      }
    ],
    {
      initialIndex: 0,
      initialEntries: ['/']
    }
  )
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => account
      }}
    >
      <RouterProvider router={history} />
    </ApiContext.Provider>
  )
  return { setCurrentAccountMock, history }
}

describe('Heder Component', () => {
  test('Should call setCurrentAccount with null', async () => {
    const { history, setCurrentAccountMock } = makeSut()
    const signOutButton = screen.getByRole('link')
    await user.click(signOutButton)
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.state.location.pathname).toBe('/login')
  })

  test('Should render username correctly', async () => {
    const account = mockAccountModel()
    makeSut(account)
    expect(screen.getByLabelText('username')).toHaveTextContent(account.name)
  })
})

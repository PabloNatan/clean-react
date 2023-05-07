import React from 'react'
import { ApiContext } from '@/presentation/contexts'
import { render, screen } from '@testing-library/react'
import { Header } from './header'
import user from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

describe('Heder Component', () => {
  test('Should call setCurrentAccount with null', async () => {
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
      <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
        <RouterProvider router={history} />
      </ApiContext.Provider>
    )
    const signOutButton = screen.getByRole('link')
    await user.click(signOutButton)
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.state.location.pathname).toBe('/login')
  })
})

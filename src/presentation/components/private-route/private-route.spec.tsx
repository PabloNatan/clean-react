import { mockAccountModel } from '@/domain/test'
import { ApiContext } from '@/presentation/contexts'
import { render } from '@testing-library/react'
import React from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { PrivateRoute } from './private-route'

type SutTypes = {
  history: ReturnType<typeof createMemoryRouter>
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryRouter(
    [
      {
        path: '/',
        element: <PrivateRoute />
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
    <ApiContext.Provider value={{ getCurrentAccount: () => account }}>
      <RouterProvider router={history} />
    </ApiContext.Provider>
  )
  return { history }
}

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const { history } = makeSut(null)
    expect(history.state.location.pathname).toBe('/login')
  })

  test('Should render current component if token is not empty', () => {
    const { history } = makeSut()
    expect(history.state.location.pathname).toBe('/')
  })
})

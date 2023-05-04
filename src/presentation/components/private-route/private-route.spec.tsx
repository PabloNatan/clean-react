import React from 'react'
import { PrivateRoute } from './private-route'
import { render } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const element = <PrivateRoute />
    const history = createMemoryRouter(
      [
        {
          path: '/',
          element
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
    render(<RouterProvider router={history} />)
    expect(history.state.location.pathname).toBe('/login')
  })
})

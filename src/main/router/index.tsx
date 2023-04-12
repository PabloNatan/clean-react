import { createBrowserRouter } from 'react-router-dom'

import { makeLogin } from '../factories/pages/login/login-factory'

export const router = createBrowserRouter([
  { path: '/', element: makeLogin({}) },
  { path: '/login', element: makeLogin({}) }
])

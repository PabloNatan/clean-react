import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { makeLogin } from '../factories/pages/login/login-factory'

export const router = createBrowserRouter([
  { path: '/', element: <></> },
  { path: '/login', element: makeLogin({}) },
  { path: '/signup', element: <></> }
])

import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { makeLogin } from '../factories/pages/login/login-factory'
import { makeSignUp } from '../factories/pages/signup/signup-factory'

export const router = createBrowserRouter([
  { path: '/', element: <></> },
  { path: '/login', element: makeLogin({}) },
  { path: '/signup', element: makeSignUp({}) }
])

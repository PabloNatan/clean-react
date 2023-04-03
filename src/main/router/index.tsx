import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { Login } from '@/presentation/pages'

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> }
])

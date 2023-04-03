import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import '@/presentation/styles/global.scss'

import { Login } from '@/presentation/pages'

const router = createBrowserRouter([{ path: '/login', element: <Login /> }])

export const Router: React.FC = () => {
  return <RouterProvider router={router} />
}

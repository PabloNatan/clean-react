import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { makeLogin, makeSignUp } from '../factories/pages'
import { SurveyList } from '@/presentation/pages'
import { PrivateRoute } from '@/presentation/components/private-route/private-route'

export const router = createBrowserRouter([
  { path: '/', element: <PrivateRoute element={<SurveyList />} /> },
  { path: '/login', element: makeLogin({}) },
  { path: '/signup', element: makeSignUp({}) }
])

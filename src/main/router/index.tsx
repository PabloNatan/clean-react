import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { PrivateRoute } from '@/presentation/components/private-route/private-route'
import {
  makeLogin,
  makeSignUp,
  makeSurveyList,
  makeSurveyResult
} from '../factories/pages'

export const router = createBrowserRouter([
  { path: '/', element: <PrivateRoute element={makeSurveyList({})} /> },
  { path: '/login', element: makeLogin({}) },
  { path: '/signup', element: makeSignUp({}) },
  {
    path: '/surveys/:id',
    element: <PrivateRoute element={makeSurveyResult({})} />
  }
])

import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { makeLogin, makeSignUp } from '../factories/pages'
import { SurveyList } from '@/presentation/pages'

export const router = createBrowserRouter([
  { path: '/', element: <SurveyList /> },
  { path: '/login', element: makeLogin({}) },
  { path: '/signup', element: makeSignUp({}) }
])

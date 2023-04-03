import React from 'react'
import ReactDom from 'react-dom'
import { RouterProvider } from 'react-router-dom'
import '@/presentation/styles/global.scss'

import { router } from './router'

ReactDom.render(
  <RouterProvider router={router} />,
  document.getElementById('main')
)

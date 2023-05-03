import '@/presentation/styles/global.scss'
import React from 'react'
import ReactDom from 'react-dom'
import { RouterProvider } from 'react-router-dom'

import { ApiContextProvider } from '@/presentation/contexts'
import { router } from './router'

ReactDom.render(
  <ApiContextProvider>
    <RouterProvider router={router} />
  </ApiContextProvider>,
  document.getElementById('main')
)

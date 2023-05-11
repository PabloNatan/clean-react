import { createRoot } from 'react-dom/client'
import '@/presentation/styles/global.scss'
import React from 'react'
import { RouterProvider } from 'react-router-dom'

import { ApiContextProvider } from '@/presentation/contexts'
import { router } from './router'

const container = document.getElementById('main')

const root = createRoot(container)

root.render(
  <ApiContextProvider>
    <RouterProvider router={router} />
  </ApiContextProvider>
)

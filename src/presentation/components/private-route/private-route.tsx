/* eslint-disable multiline-ternary */
import { useApiContext } from '@/presentation/contexts'
import React from 'react'
import { Navigate, Route, type RouteProps } from 'react-router-dom'

export const PrivateRoute: React.FC<RouteProps> = (props: RouteProps) => {
  const { getCurrentAccount } = useApiContext()
  return getCurrentAccount()?.accessToken ? (
    <Route {...props} />
  ) : (
    <Navigate to="/login" />
  )
}

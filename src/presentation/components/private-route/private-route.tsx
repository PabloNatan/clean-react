/* eslint-disable multiline-ternary */
import { useApiContext } from '@/presentation/contexts'
import React, { type ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
  element?: ReactElement
}

export const PrivateRoute: React.FC<Props> = ({ element = <></> }: Props) => {
  const { getCurrentAccount } = useApiContext()
  return getCurrentAccount()?.accessToken ? element : <Navigate to="/login" />
}

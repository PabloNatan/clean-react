import { type AccountModel } from '@/domain/models'
import { setCurrentAccountAdapter } from '@/main/adapters'
import React, { createContext, useContext, type ReactNode } from 'react'

type IApiContext = {
  setCurrentAccount?: (account: AccountModel) => void
  getCurrentAccount?: () => AccountModel
}

export const ApiContext = createContext<IApiContext>(null)

export const ApiContextProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  return (
    <ApiContext.Provider
      value={{ setCurrentAccount: setCurrentAccountAdapter }}
    >
      {children}
    </ApiContext.Provider>
  )
}

export const useApiContext = (): IApiContext => useContext(ApiContext)

import React, { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import { ApiContextProvider, useApiContext } from './api-context'
import {
  getCurrentAccountAdapter,
  setCurrentAccountAdapter
} from '@/main/adapters'

jest.mock('@/main/adapters', () => {
  return {
    getCurrentAccountAdapter: jest.fn(),
    setCurrentAccountAdapter: jest.fn()
  }
})

const Children: React.FC = () => {
  const { getCurrentAccount, setCurrentAccount } = useApiContext()
  useEffect(() => {
    getCurrentAccount()
    setCurrentAccount({ accessToken: '', name: 'Juan' })
  }, [])
  return <div>Child Element</div>
}

const makeSut = (): void => {
  render(
    <ApiContextProvider>
      <Children />
    </ApiContextProvider>
  )
}

describe('APIContext', () => {
  it('Should receive the correct adapters', () => {
    makeSut()
    expect(getCurrentAccountAdapter).toHaveBeenCalled()
    expect(setCurrentAccountAdapter).toHaveBeenCalled()
  })

  it('Should render child elmenet content', () => {
    makeSut()
    expect(screen.getByText(/child element/i)).toBeInTheDocument()
  })
})

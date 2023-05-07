import { AccessDeniedError } from '@/domain/errors'
import { useNavigate } from 'react-router-dom'
import { useApiContext } from '../contexts'

type CallBackType = (error: Error) => void
type ResultType = CallBackType

export function useErrorHandler(callback: CallBackType): ResultType {
  const navigate = useNavigate()
  const { setCurrentAccount } = useApiContext()

  return (error: Error) => {
    if (error instanceof AccessDeniedError) {
      setCurrentAccount(undefined)
      navigate('/login')
    } else {
      callback(error)
    }
  }
}

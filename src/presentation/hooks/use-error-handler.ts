import { AccessDeniedError } from '@/domain/errors'
import { useLogout } from '@/presentation/hooks'

type CallBackType = (error: Error) => void
type ResultType = CallBackType

export function useErrorHandler(callback: CallBackType): ResultType {
  const logout = useLogout()
  return (error: Error) => {
    if (error instanceof AccessDeniedError) {
      logout()
    } else {
      callback(error)
    }
  }
}

import { useNavigate } from 'react-router-dom'
import { useApiContext } from '../contexts'

type ResultType = () => void

export function useLogout(): ResultType {
  const navigate = useNavigate()
  const { setCurrentAccount } = useApiContext()
  return (): void => {
    setCurrentAccount(undefined)
    navigate('/login')
  }
}

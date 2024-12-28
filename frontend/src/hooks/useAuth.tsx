import { AuthContext } from '@/contexts/AuthProvider'
import { useContext } from "react"

export const useAuth = () => {
  const authContext = useContext(AuthContext)

  // If authContext is null or undefined
  if (!authContext) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return authContext
}

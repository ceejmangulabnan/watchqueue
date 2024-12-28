import { useNavigate } from 'react-router-dom'
import { useCallback, createContext, useState, ReactNode, useEffect } from "react"
import { axiosBase } from '@/api/axios'
import { AxiosError } from 'axios'

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export interface Auth {
  username: string | null,
  id: number | null,
  accessToken: string | null
}

interface AuthContextValue {
  auth: Auth,
  setAuth: React.Dispatch<React.SetStateAction<Auth>>
  isAuthLoading: boolean
  logout: () => Promise<void>
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<Auth>({
    username: null,
    id: null,
    accessToken: null
  })
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const navigate = useNavigate()

  const initializeAuth = useCallback(async () => {
    try {
      // Get new access token
      const refreshResponse = await axiosBase.get('/users/refresh')
      const newAccessToken = refreshResponse.data.access_token

      // Get user data with new access token
      const userResponse = await axiosBase.get('/users/me', {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
          'Content-Type': 'application/json'
        },
      })

      const userData = userResponse.data

      setAuth({
        accessToken: newAccessToken,
        id: userData.id,
        username: userData.username
      })

    } catch (error) {
      const authError = error as AxiosError
      // Clear auth state if authentication fails
      console.error('Auth initialization error:', authError.response?.data)
      setAuth({ username: null, id: null, accessToken: null })
    } finally {
      setIsAuthLoading(false)
    }
  }, [])

  // Set auth state on initial render
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await axiosBase.post("/users/logout")
      setAuth({ username: null, id: null, accessToken: null })
      navigate('/', { replace: true })
    } catch (error) {
      const logoutError = error as AxiosError
      setAuth({ username: null, id: null, accessToken: null })
      navigate('/', { replace: true })
      console.error('Logout error:', logoutError.response?.data)
    }
  }, [navigate])

  return (
    <AuthContext.Provider value={{ auth, setAuth, isAuthLoading, logout }}>
      {children}
    </AuthContext.Provider >
  )
}

export default AuthProvider

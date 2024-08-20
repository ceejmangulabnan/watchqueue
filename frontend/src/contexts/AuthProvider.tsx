import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react"
import api from "../components/ApiInstance"

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// For checking if user is authenticated on the server
export const useAuth = () => {
  // Payload of access token?
  const authContext = useContext(AuthContext)

  // If authContext is null or undefined
  if (!authContext) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return authContext
}

interface AuthProviderProps {
  children: ReactNode
}

interface Auth {
  username: string,
  id: number | null,
  accessToken: string
}

interface AuthContextValue {
  auth: Auth,
  setAuth: React.Dispatch<React.SetStateAction<Auth>>
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<Auth>({
    username: '',
    id: null,
    accessToken: ''
  })

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await api.get('/users/me')
        const data = await response.data
        setAuth({
          ...auth,
          accessToken: data.access_token as string
        })

      } catch {
        console.log('Not authed')
      }
    }

    getCurrentUser()
  }, [])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider >
  )
}

export default AuthProvider

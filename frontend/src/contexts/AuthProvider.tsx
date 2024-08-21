import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react"
import { axiosPrivate } from "../api/axios"

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
  username: string | null,
  id: number | null,
  accessToken: string | null
}

interface AuthContextValue {
  auth: Auth,
  setAuth: React.Dispatch<React.SetStateAction<Auth>>
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<Auth>({
    username: null,
    id: null,
    accessToken: null
  })

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider >
  )
}

export default AuthProvider

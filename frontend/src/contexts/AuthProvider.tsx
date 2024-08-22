import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react"

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

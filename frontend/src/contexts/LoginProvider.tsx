import { ReactNode, createContext, useState } from 'react'

export const LoginContext = createContext<LoginContextValue | undefined>(undefined)

interface LoginProviderChildren {
  children: ReactNode
}


interface LoginContextValue {
  isLoggedIn: boolean,
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}


const LoginProvider = ({ children }: LoginProviderChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginProvider


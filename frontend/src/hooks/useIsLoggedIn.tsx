import { useContext } from "react"
import { LoginContext } from "../contexts/LoginProvider"

const useIsLoggedIn = () => {
  const loginContext = useContext(LoginContext)

  if (!loginContext) {
    throw new Error('useIsLoggedIn must be used within AuthProvider')
  }


  return loginContext
}

export default useIsLoggedIn

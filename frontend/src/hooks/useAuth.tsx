import { AuthContext } from "../contexts/AuthProvider"
import { useContext } from "react"

// For checking if user is authenticated on the server
export const useAuth = () => {
  const authContext = useContext(AuthContext)

  // If authContext is null or undefined
  if (!authContext) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  // Check if auth has null values
  // if (!Object.values(authContext.auth).includes(null)) {
  //   setIsLoggedIn(true)
  // }

  return authContext
}

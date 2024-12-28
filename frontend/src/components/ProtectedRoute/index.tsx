import { useAuth } from "@/hooks/useAuth"
import { useNavigate, Outlet } from "react-router-dom"
const ProtectedRoute = () => {
  const { auth, isAuthLoading, logout } = useAuth()
  const navigate = useNavigate()

  if (isAuthLoading) {
    return <div>Loading...</div>
  }

  const isAuthenticated = auth.accessToken !== null &&
    auth.username !== null &&
    auth.id !== null

  // useLayoutEffect(() => {
  //   const verifyUser = async () => {
  //     if (!auth?.accessToken) {
  //       await refreshUser()
  //     }
  //     setIsLoading(false)
  //   }
  //
  //   verifyUser()
  // }, [auth, refreshUser])

  if (isAuthLoading) {
    // TODO: Replace with proper loading screen / loading spinner
    return <div>Loading...</div>
  }


  if (!isAuthenticated) {
    logout()
    navigate('/', { replace: true })
  }

  return <Outlet />
}

export default ProtectedRoute

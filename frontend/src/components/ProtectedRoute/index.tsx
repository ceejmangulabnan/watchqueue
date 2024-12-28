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

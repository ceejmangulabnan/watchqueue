import LoadingSpinner from '@/components/ui/spinner'
import { useAuth } from "@/hooks/useAuth"
import { useNavigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
  const { auth, isAuthLoading, logout } = useAuth()
  const navigate = useNavigate()

  const isAuthenticated = auth.accessToken !== null &&
    auth.username !== null &&
    auth.id !== null

  if (isAuthLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    logout()
    navigate('/', { replace: true })
  }

  return <Outlet />
}

export default ProtectedRoute

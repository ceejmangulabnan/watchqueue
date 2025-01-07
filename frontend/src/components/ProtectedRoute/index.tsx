import LoadingSpinner from '@/components/ui/spinner'
import { useAuth } from "@/hooks/useAuth"
import { useUserWatchlists } from '@/hooks/useUserWatchlists'
import { useNavigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
  const { auth, logout } = useAuth()
  const { isUserWatchlistsLoading } = useUserWatchlists()
  const navigate = useNavigate()

  const isAuthenticated = auth.accessToken !== null &&
    auth.username !== null &&
    auth.id !== null

  if (isUserWatchlistsLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    logout()
    navigate('/', { replace: true })
  }

  return <Outlet />
}

export default ProtectedRoute

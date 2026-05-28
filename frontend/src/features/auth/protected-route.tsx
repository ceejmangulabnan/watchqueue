import LoadingSpinner from '@/components/ui/spinner'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useUserWatchlists } from '@/features/watchlist/hooks/use-user-watchlists'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    const { auth, isAuthLoading } = useAuth()
    const { isUserWatchlistsLoading } = useUserWatchlists()

    const isAuthenticated =
        auth.accessToken !== null && auth.username !== null && auth.id !== null

    if (isAuthLoading || isUserWatchlistsLoading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default ProtectedRoute

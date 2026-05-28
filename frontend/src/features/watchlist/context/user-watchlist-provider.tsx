import { createContext, ReactNode } from 'react'
import useAxiosPrivate from '@/features/auth/hooks/use-axios-private'
import {
    useQuery,
    RefetchOptions,
    QueryObserverResult,
} from '@tanstack/react-query'
import { WatchlistData } from '@/features/watchlist/types/watchlist-types'
import { useAuth } from '@/features/auth/hooks/use-auth'

export const UserWatchlistContext = createContext<
    UserWatchlistContextValue | undefined
>(undefined)

interface UserWatchlistProviderProps {
    children: ReactNode
}

interface UserWatchlistContextValue {
    userWatchlists: WatchlistData[] | undefined
    isUserWatchlistsLoading: boolean
    refetchUserWatchlists: (
        options?: RefetchOptions | undefined
    ) => Promise<QueryObserverResult<WatchlistData[], Error>>
}

const UserWatchlistProvider = ({ children }: UserWatchlistProviderProps) => {
    const axiosPrivate = useAxiosPrivate()
    const { auth } = useAuth()

    const fetchUserWatchlists = async () => {
        const response = await axiosPrivate.get(`/watchlists/user/${auth.id}`)
        return response.data as WatchlistData[]
    }

    const {
        data: userWatchlists,
        isLoading: isUserWatchlistsLoading,
        refetch: refetchUserWatchlists,
    } = useQuery({
        queryKey: ['userWatchlists'],
        queryFn: fetchUserWatchlists,
        enabled: auth && !Object.values(auth).includes(null),
    })

    return (
        <UserWatchlistContext.Provider
            value={{
                userWatchlists,
                isUserWatchlistsLoading,
                refetchUserWatchlists,
            }}
        >
            {children}
        </UserWatchlistContext.Provider>
    )
}

export default UserWatchlistProvider

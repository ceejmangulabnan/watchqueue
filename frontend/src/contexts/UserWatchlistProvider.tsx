import { createContext, ReactNode } from "react"
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { WatchlistData } from '@/types/WatchlistTypes'
import { useAuth } from '@/hooks/useAuth'

export const UserWatchlistContext = createContext<UserWatchlistContextValue | undefined>(undefined)

interface UserWatchlistProviderProps {
  children: ReactNode
}

interface UserWatchlistContextValue {
  userWatchlists: WatchlistData[] | undefined
  isUserWatchlistsLoading: boolean
}

const UserWatchlistProvider = ({ children }: UserWatchlistProviderProps) => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()

  const fetchUserWatchlists = async () => {
    const response = await axiosPrivate.get(`/watchlists/user/${auth.id}`)
    return response.data as WatchlistData[]
  }

  const { data: userWatchlists, isLoading: isUserWatchlistsLoading } = useQuery({
    queryKey: ['userWatchlists'],
    queryFn: fetchUserWatchlists
  })

  return (
    <UserWatchlistContext.Provider value={{ userWatchlists, isUserWatchlistsLoading }}>
      {children}
    </UserWatchlistContext.Provider>
  )
}

export default UserWatchlistProvider

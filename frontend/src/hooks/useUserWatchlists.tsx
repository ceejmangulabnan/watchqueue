import { UserWatchlistContext } from '@/contexts/UserWatchlistProvider'
import { useContext } from 'react'

export const useUserWatchlists = () => {
  const userWatchlistContext = useContext(UserWatchlistContext)

  // if userWatchlistContext is null or undefined
  if (!userWatchlistContext) {
    throw new Error('useUserWatchlists must be used within UserWatchlistProvider')
  }

  return userWatchlistContext
}

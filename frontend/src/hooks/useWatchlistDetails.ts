import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { WatchlistData } from '@/types/WatchlistTypes'

const useWatchlistDetails = (watchlistId: string | undefined) => {
  const axiosPrivate = useAxiosPrivate()

  const fetchWatchlistDetails = async () => {
    const response = await axiosPrivate.get(`/watchlists/${watchlistId}`)
    return response.data as WatchlistData
  }

  return useQuery({ queryKey: ['watchlistDetails', Number(watchlistId)], queryFn: fetchWatchlistDetails, enabled: !!watchlistId })
}

export default useWatchlistDetails

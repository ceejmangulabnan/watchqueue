import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/features/auth/hooks/use-axios-private'
import { WatchlistData } from '@/features/watchlist/types/watchlist-types'

const useWatchlistDetails = (watchlistId: string | undefined) => {
    const axiosPrivate = useAxiosPrivate()

    const fetchWatchlistDetails = async () => {
        const response = await axiosPrivate.get(`/watchlists/${watchlistId}`)
        return response.data as WatchlistData
    }

    return useQuery({
        queryKey: ['watchlistDetails', Number(watchlistId)],
        queryFn: fetchWatchlistDetails,
    })
}

export default useWatchlistDetails

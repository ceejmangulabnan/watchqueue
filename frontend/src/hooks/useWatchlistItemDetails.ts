import { useQueries } from '@tanstack/react-query'
import axiosBase from '@/api/axios'
import { WatchlistItem } from '@/types/WatchlistTypes'
import { MovieDetails } from '@/types/MovieTypes'
import { TvDetails } from '@/types/TvTypes'
import { WatchlistItemDetailsQuery } from '@/pages/WatchlistDetailsPage'
import { WatchlistData } from '@/types/WatchlistTypes'

const useWatchlistItemDetails = (watchlistDetails: WatchlistData | undefined) => {
  const fetchWatchlistItemDetails = async (watchlistItem: WatchlistItem) => {
    if (watchlistItem.media_type === "movie") {
      const response = await axiosBase.get(`/movies/${watchlistItem.id}`)
      const watchlistItemDetails: WatchlistItemDetailsQuery = {
        type: "movie",
        mediaData: response.data as MovieDetails
      }
      return watchlistItemDetails

    } else if (watchlistItem.media_type === "tv") {
      const response = await axiosBase.get(`/tv/${watchlistItem.id}`)
      const watchlistItemDetails: WatchlistItemDetailsQuery = {
        type: "tv",
        mediaData: response.data as TvDetails
      }
      return watchlistItemDetails
    }
  }


  // Collects data of watchlist items
  return useQueries({
    queries: watchlistDetails ? watchlistDetails?.items.map(watchlistItem => ({
      queryKey: ["watchlistItemDetails", watchlistItem.id],
      queryFn: () => fetchWatchlistItemDetails(watchlistItem),
      enabled: watchlistDetails.items.length > 0
    }))
      : [],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      }
    },
  })
}
export default useWatchlistItemDetails

import { useParams } from 'react-router-dom'
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { WatchlistData, WatchlistItem } from '@/types/WatchlistTypes'
import { MovieDetails } from '@/types/MovieTypes'
import MovieItem from '@/components/Movies/MovieItem'
import TvItem from '@/components/TvItem'
import { TvDetails } from '@/types/TvTypes'

const WatchlistDetailsPage = () => {
  const { watchlistId } = useParams()
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  // Distinguish movie and tv items
  type WatchlistItemDetailsQuery = {
    type: "movie" | "tv"
    mediaData: MovieDetails | TvDetails
  }

  const fetchWatchlistDetails = async () => {
    const response = await axiosPrivate.get(`/watchlists/${watchlistId}`)
    return response.data as WatchlistData
  }

  const fetchWatchlistItemDetails = async (watchlistItem: WatchlistItem) => {
    if (watchlistItem.media_type === "movie") {
      const response = await axiosPrivate.get(`/movies/${watchlistItem.id}`)
      const watchlistItemDetails: WatchlistItemDetailsQuery = {
        type: "movie",
        mediaData: response.data as MovieDetails
      }
      return watchlistItemDetails

    } else if (watchlistItem.media_type === "tv") {
      const response = await axiosPrivate.get(`/tv/${watchlistItem.id}`)
      const watchlistItemDetails: WatchlistItemDetailsQuery = {
        type: "tv",
        mediaData: response.data as TvDetails
      }
      return watchlistItemDetails
    }
  }

  const { data: watchlistDetails } = useQuery({ queryKey: ['watchlistDetails', Number(watchlistId)], queryFn: fetchWatchlistDetails })

  // Collects data of watchlist items
  const watchlistItemsDetails = useQueries({
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

  const handleRemoveFromWatchlist = async (watchlistId: number, mediaType: string, itemId: number) => {
    const response = await axiosPrivate.delete(`/watchlists/${watchlistId}/${mediaType}/${itemId}`)
    if (response.status === 200) {
      queryClient.invalidateQueries({ queryKey: ['watchlistDetails', watchlistId] })
    }
  }

  return (
    <div className='mx-10 md:mx-20 my-10'>
      <div className='mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]'>
        <h3 className="text-xl font-semibold py-4">{watchlistDetails?.title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
          {
            !watchlistItemsDetails.pending && watchlistItemsDetails.data.map((watchlistItem) => {
              if (watchlistItem?.type === "movie") {
                return (
                  <MovieItem
                    key={watchlistItem?.mediaData.id}
                    movie={watchlistItem?.mediaData as MovieDetails}
                    inWatchlist={true}
                    handleRemoveFromWatchlist={handleRemoveFromWatchlist}
                    currentWatchlist={watchlistDetails}
                  />
                )
              } else if (watchlistItem?.type === "tv") {
                return <TvItem key={watchlistItem.mediaData.id} tv={watchlistItem.mediaData as TvDetails} currentWatchlist={watchlistDetails} inWatchlist={true} handleRemoveFromWatchlist={handleRemoveFromWatchlist} />
              } else {
                return null
              }
            })
          }
        </div>
      </div>
    </div>
  )
}

export default WatchlistDetailsPage

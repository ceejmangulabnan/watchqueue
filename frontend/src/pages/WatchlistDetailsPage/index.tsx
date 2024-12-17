import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { WatchlistData, WatchlistItem } from '@/types/WatchlistTypes'
import { MovieDetails } from '@/types/MovieTypes'
import { TvDetails } from '@/types/TvTypes'
import WatchlistItemView from '@/components/WatchlistItemView'
import WatchlistTableView from '@/components/WatchlistTableView'

// Distinguish movie and tv items
export type WatchlistItemDetailsQuery = {
  type: "movie" | "tv"
  mediaData: MovieDetails | TvDetails
}

const WatchlistDetailsPage = () => {
  const { watchlistId } = useParams()
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const [view, setView] = useState('item')


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

        {/* Toggle buttons for switching views */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 border ${view === 'item' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('item')}
          >
            Item View
          </button>
          <button
            className={`px-4 py-2 border ${view === 'table' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('table')}
          >
            Table View
          </button>
        </div>
        {(() => {
          switch (view) {
            case 'item':
              return (
                <WatchlistItemView
                  watchlistItemsDetails={watchlistItemsDetails}
                  watchlistDetails={watchlistDetails}
                  handleRemoveFromWatchlist={handleRemoveFromWatchlist}
                />
              )
            case 'table':
              return (
                <WatchlistTableView
                  watchlistItemsDetails={watchlistItemsDetails}
                  watchlistDetails={watchlistDetails}
                  handleRemoveFromWatchlist={handleRemoveFromWatchlist}
                />
              )
            default:
              return <p>Select a view to display.</p>
          }
        })()}
      </div>
    </div>
  )
}

export default WatchlistDetailsPage

import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query'
import axiosBase from '@/api/axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { WatchlistData, WatchlistItem } from '@/types/WatchlistTypes'
import { MovieDetails } from '@/types/MovieTypes'
import { TvDetails } from '@/types/TvTypes'
import { Grid3x3, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    const response = await axiosBase.get(`/watchlists/${watchlistId}`)
    return response.data as WatchlistData
  }

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

        <div className='flex items-center gap-2 mb-4'>
          {/* Toggle buttons for switching views */}
          <div className="inline-flex items-center rounded-md border border-input bg-transparent shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView('item')}
              className={`rounded-r-none ${view === 'item' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView('table')}
              className={`rounded-l-none ${view === 'table' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Table className="h-4 w-4" />
            </Button>
          </div>
          {
            view === "table" ? <p>Table View</p> : <p>Grid View</p>
          }
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

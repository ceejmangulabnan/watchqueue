import { MovieDetails } from '@/types/MovieTypes'
import { TvDetails } from '@/types/TvTypes'
import TvItem from '@/components/TvItem'
import MovieItem from '@/components/Movies/MovieItem'
import { WatchlistData } from '@/types/WatchlistTypes'
import { WatchlistItemDetailsQuery } from '@/pages/WatchlistDetailsPage'

interface WatchlistItemViewProps {
  watchlistItemsDetails: {
    data: (WatchlistItemDetailsQuery | undefined)[];
    pending: boolean;
  }
  watchlistDetails: WatchlistData | undefined
  handleRemoveFromWatchlist: (watchlistId: number, mediaType: string, itemId: number) => Promise<void>
}

const WatchlistItemView = ({ watchlistItemsDetails, watchlistDetails, handleRemoveFromWatchlist }: WatchlistItemViewProps) => {
  return (

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
  )
}

export default WatchlistItemView

import { MovieDetails } from '@/types/MovieTypes'
import { TvDetails } from '@/types/TvTypes'
import TvItem from '@/components/TvItem'
import MovieItem from '@/components/Movies/MovieItem'
import { WatchlistData } from '@/types/WatchlistTypes'
import { WatchlistItemDetailsQuery } from '@/pages/WatchlistDetailsPage'
import MediaItemSkeleton from '@/components/Skeletons/MediaItemSkeleton'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

interface WatchlistItemViewProps {
  watchlistItemsDetails: {
    data: (WatchlistItemDetailsQuery | undefined)[];
    pending: boolean;
  }
  watchlistDetails: WatchlistData | undefined
  handleRemoveFromWatchlist: (watchlistId: number, mediaType: string, itemId: number) => Promise<void>
}

const WatchlistItemView = ({ watchlistItemsDetails, watchlistDetails, handleRemoveFromWatchlist }: WatchlistItemViewProps) => {

  const numberOfSkeletons = watchlistDetails?.items.length || 4;

  // Show skeletons while data is pending
  if (watchlistItemsDetails.pending) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {[...Array(numberOfSkeletons)].map((_, index) => (
          <MediaItemSkeleton key={index} />
        ))}
      </div>
    )
  }

  // Show if watchlist is empty
  if (!watchlistItemsDetails.pending && watchlistItemsDetails.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Watchlist is empty</h3>
          <p className="text-foreground">Add movies or TV shows to your watchlist to see them here.</p>
        </div>
        <Button variant={'outline'}>
          <Link to='/'>
            Continue Browsing
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
      {
        watchlistItemsDetails.data.map((watchlistItem) => {
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
            return (
              <TvItem
                key={watchlistItem.mediaData.id}
                tv={watchlistItem.mediaData as TvDetails}
                currentWatchlist={watchlistDetails}
                inWatchlist={true}
                handleRemoveFromWatchlist={handleRemoveFromWatchlist} />
            )
          } else {
            return null
          }
        })
      }
    </div>
  )
}

export default WatchlistItemView

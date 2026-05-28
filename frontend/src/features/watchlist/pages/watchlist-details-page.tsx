import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/features/auth/hooks/use-axios-private'
import { MovieDetails } from '@/features/movies/types/movie-types'
import { TvDetails } from '@/features/tv/types/tv-types'
import WatchlistItemView from '@/features/watchlist/components/watchlist-item-view'
import WatchlistTableView from '@/features/watchlist/components/watchlist-table-view'
import WatchlistViewToggle from '@/features/watchlist/components/watchlist-view-toggle'
import useWatchlistDetails from '@/features/watchlist/hooks/use-watchlist-details'
import useWatchlistItemDetails from '@/features/watchlist/hooks/use-watchlist-item-details'

// Distinguish movie and tv items
export type WatchlistItemDetailsQuery = {
    type: 'movie' | 'tv'
    mediaData: MovieDetails | TvDetails
}

const WatchlistDetailsPage = () => {
    const { watchlistId } = useParams()
    const axiosPrivate = useAxiosPrivate()
    const queryClient = useQueryClient()
    const [view, setView] = useState('item')
    const { data: watchlistDetails } = useWatchlistDetails(watchlistId)
    const watchlistItemsDetails = useWatchlistItemDetails(watchlistDetails)

    const handleRemoveFromWatchlist = async (
        watchlistId: number,
        mediaType: string,
        itemId: number
    ) => {
        const response = await axiosPrivate.delete(
            `/watchlists/${watchlistId}/${mediaType}/${itemId}`
        )
        if (response.status === 200) {
            queryClient.invalidateQueries({
                queryKey: ['watchlistDetails', watchlistId],
            })
            queryClient.invalidateQueries({ queryKey: ['userWatchlists'] })
        }
    }

    return (
        <div className="mx-10 md:mx-20 my-10">
            <div className="mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]">
                <div className="flex  justify-between">
                    <h3 className="text-xl font-semibold py-4">
                        {watchlistDetails?.title}
                    </h3>
                    <WatchlistViewToggle view={view} setView={setView} />
                </div>
                {view === 'item' ? (
                    <WatchlistItemView
                        watchlistItemsDetails={watchlistItemsDetails}
                        watchlistDetails={watchlistDetails}
                        handleRemoveFromWatchlist={handleRemoveFromWatchlist}
                    />
                ) : (
                    <WatchlistTableView
                        watchlistItemsDetails={watchlistItemsDetails}
                        watchlistDetails={watchlistDetails}
                        handleRemoveFromWatchlist={handleRemoveFromWatchlist}
                    />
                )}
            </div>
        </div>
    )
}

export default WatchlistDetailsPage

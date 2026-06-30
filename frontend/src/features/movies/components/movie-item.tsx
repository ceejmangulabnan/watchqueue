import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardDescription,
    CardTitle,
    CardFooter,
} from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import WatchlistItemDropdownContent from '@/features/watchlist/components/watchlist-item-dropdown-content'
import MediaItemSkeleton from '@/features/common/components/media-item-skeleton'
import { WatchlistData } from '@/features/watchlist/types/watchlist-types'
import { MovieData, MovieDetails } from '@/features/movies/types/movie-types'
import { generatePosterLink, FALLBACK_POSTER } from '@/utils'
import { Ellipsis } from 'lucide-react'
import { useUserWatchlists } from '@/features/watchlist/hooks/use-user-watchlists'

interface MovieItemProps {
    movie: MovieData
    currentWatchlist?: WatchlistData
    inWatchlist?: boolean
    handleRemoveFromWatchlist?: (
        watchlistId: number,
        mediaType: string,
        itemId: number
    ) => Promise<void>
}

const MovieItem = ({
    movie,
    currentWatchlist,
    inWatchlist,
    handleRemoveFromWatchlist,
}: MovieItemProps) => {
    const { userWatchlists, isUserWatchlistsLoading } = useUserWatchlists()
    const navigate = useNavigate()
    const posterLink = generatePosterLink(movie.poster_path)

    if (isUserWatchlistsLoading) {
        return <MediaItemSkeleton />
    }

    return (
        <Card
            className="overflow-hidden relative rounded-none border-none group/movie-item"
            onClick={() => navigate(`/movie/${movie.id}`)}
        >
            <DropdownMenu>
                <DropdownMenuTrigger
                    asChild
                    className="absolute right-2 top-2 z-40"
                >
                    <Button className="p-0 w-6 h-6 rounded-full bg-white hover:bg-white shadow">
                        <Ellipsis color="#000000" size={16} />
                    </Button>
                </DropdownMenuTrigger>
                {/* Dropdown Content */}
                {userWatchlists && (
                    <WatchlistItemDropdownContent
                        userWatchlists={userWatchlists}
                        isUserWatchlistsLoading={isUserWatchlistsLoading}
                        itemDetails={movie as MovieDetails}
                        mediaType="movie"
                        inWatchlist={inWatchlist}
                        currentWatchlist={currentWatchlist}
                        handleRemoveFromWatchlist={handleRemoveFromWatchlist}
                    />
                )}
            </DropdownMenu>

            <div className="overflow-hidden rounded-md">
                <img
                    src={posterLink}
                    loading="lazy"
                    className="object-cover w-full hover:scale-105 transition-transform ease-in"
                    onError={(e) => {
                        ;(e.target as HTMLImageElement).src = FALLBACK_POSTER
                    }}
                />
            </div>

            <CardFooter className="flex-col items-start p-0 pt-4">
                <CardTitle className="text-sm md:text-md truncate w-full group-hover/movie-item:text-red-500 group-hover/movie-item:ease-in group-hover/movie-item:transition-all cursor-pointer">
                    {movie.title}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm lg:text-md">
                    {movie?.release_date.slice(0, 4) ?? 'N/A'}
                </CardDescription>
            </CardFooter>
        </Card>
    )
}

export default MovieItem

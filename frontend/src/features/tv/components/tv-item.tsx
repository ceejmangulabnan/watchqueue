import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardTitle,
    CardFooter,
    CardDescription,
} from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import WatchlistItemDropdownContent from '@/features/watchlist/components/watchlist-item-dropdown-content'
import MediaItemSkeleton from '@/features/common/components/media-item-skeleton'
import { TvData, TvDetails } from '@/features/tv/types/tv-types'
import { WatchlistData } from '@/features/watchlist/types/watchlist-types'
import { generatePosterLink, FALLBACK_POSTER } from '@/utils'
import { Ellipsis } from 'lucide-react'
import { useUserWatchlists } from '@/features/watchlist/hooks/use-user-watchlists'

interface TvItemProps {
    tv: TvData
    currentWatchlist?: WatchlistData
    inWatchlist?: boolean
    handleRemoveFromWatchlist?: (
        watchlistId: number,
        mediaType: string,
        itemId: number
    ) => Promise<void>
}

const TvItem = ({
    tv,
    currentWatchlist,
    inWatchlist,
    handleRemoveFromWatchlist,
}: TvItemProps) => {
    const navigate = useNavigate()
    const { userWatchlists, isUserWatchlistsLoading } = useUserWatchlists()
    const posterLink = generatePosterLink(tv.poster_path)

    if (isUserWatchlistsLoading) {
        return <MediaItemSkeleton />
    }

    return (
        <Card className="overflow-hidden relative rounded-none border-none">
            <DropdownMenu>
                <DropdownMenuTrigger
                    asChild
                    className="absolute right-2 top-2 z-50"
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
                        itemDetails={tv as TvDetails}
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
                    className="object-cover w-full hover:scale-105 transition-transform ease-in"
                    loading="lazy"
                    onClick={() => navigate(`/tv/${tv.id}`)}
                    onError={(e) => {
                        ;(e.target as HTMLImageElement).src = FALLBACK_POSTER
                    }}
                />
            </div>
            <CardFooter className="flex-col items-start p-0 pt-4">
                <CardTitle className="text-sm md:text-md truncate w-full">
                    {tv.name}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm lg:text-md">
                    {tv.first_air_date.slice(0, 4)}
                </CardDescription>
            </CardFooter>
        </Card>
    )
}

export default TvItem

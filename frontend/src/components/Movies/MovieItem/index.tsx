import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFetchWatchlists from '@/hooks/useFetchWatchlists'
import { Card, CardDescription, CardTitle, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import WatchlistItemDropdownContent from '@/components/WatchlistItem/WatchlistItemDropdownContent'
import { WatchlistData } from '@/types/WatchlistTypes'
import { MovieData, MovieDetails } from "@/types/MovieTypes"
import { generatePosterLink } from "@/utils/generateImgLinks"
import { Ellipsis } from 'lucide-react'

interface MovieItemProps {
  movie: MovieData
  currentWatchlist?: WatchlistData
  inWatchlist?: boolean
  handleRemoveFromWatchlist?: (watchlistId: number, mediaType: string, itemId: number) => Promise<void>
}

const MovieItem = ({ movie, currentWatchlist, inWatchlist, handleRemoveFromWatchlist }: MovieItemProps) => {
  const navigate = useNavigate()
  const [posterLink, setPosterLink] = useState(() => generatePosterLink(movie.poster_path))
  const { userWatchlists, isLoading } = useFetchWatchlists()

  const handlePosterError = () => {
    setPosterLink("https://placehold.co/400x600?text=Poster+Unavailable&font=lato")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-start">
        <Skeleton className="h-[18rem] w-full" />
        <div className="mt-4 space-y-2 h-20 w-full">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='absolute right-2 top-2'>
          <Button className='p-0 w-6 h-6 rounded-full bg-white hover:bg-white shadow'>
            <Ellipsis color='#000000' size={16} />
          </Button>
        </DropdownMenuTrigger>
        {/* Dropdown Content */}
        {
          userWatchlists &&
          <WatchlistItemDropdownContent userWatchlists={userWatchlists} isUserWatchlistsLoading={isLoading} itemDetails={movie as MovieDetails} mediaType='movie' inWatchlist={inWatchlist} currentWatchlist={currentWatchlist} handleRemoveFromWatchlist={handleRemoveFromWatchlist} />
        }
      </DropdownMenu>

      <img onClick={() => navigate(`/movie/${movie.id}`)} src={posterLink} onError={handlePosterError} />

      <CardFooter className="flex-col items-start p-4">
        <CardTitle className='text-sm md:text-md truncate w-full'>{movie.title}</CardTitle>
        <CardDescription className='text-xs md:text-sm lg:text-md'>{movie?.release_date.slice(0, 4) ?? "N/A"}</CardDescription>
      </CardFooter>
    </Card>
  )
}

export default MovieItem

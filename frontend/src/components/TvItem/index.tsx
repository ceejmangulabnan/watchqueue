import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFetchWatchlists from '@/hooks/useFetchWatchlists'
import { Card, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import WatchlistItemDropdownContent from '@/components/WatchlistItem/WatchlistItemDropdownContent'
import { TvData, TvDetails } from '@/types/TvTypes'
import { WatchlistData } from '@/types/WatchlistTypes'
import { generatePosterLink } from '@/utils/generateImgLinks'
import { Ellipsis } from 'lucide-react'

interface TvItemProps {
  tv: TvData
  currentWatchlist?: WatchlistData
  inWatchlist?: boolean
  handleRemoveFromWatchlist?: (watchlistId: number, mediaType: string, itemId: number) => Promise<void>
}

const TvItem = ({ tv, currentWatchlist, inWatchlist, handleRemoveFromWatchlist }: TvItemProps) => {
  const navigate = useNavigate()
  const [posterLink, setPosterLink] = useState(() => generatePosterLink(tv.poster_path))
  const { userWatchlists, isLoading } = useFetchWatchlists()

  const handlePosterError = () => {
    setPosterLink("https://placehold.co/400x600?text=Poster+Unavailable&font=lato")
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
          <WatchlistItemDropdownContent userWatchlists={userWatchlists} isUserWatchlistsLoading={isLoading} itemDetails={tv as TvDetails} mediaType='movie' inWatchlist={inWatchlist} currentWatchlist={currentWatchlist} handleRemoveFromWatchlist={handleRemoveFromWatchlist} />

        }
      </DropdownMenu>

      <img onClick={() => navigate(`/tv/${tv.id}`)} src={posterLink} onError={handlePosterError} />

      <CardFooter className="flex-col items-start p-4">
        <CardTitle className='text-sm md:text-md truncate w-full'>{tv.name}</CardTitle>
        <CardDescription className='text-xs md:text-sm lg:text-md'>{tv.first_air_date.slice(0, 4)}</CardDescription>
      </CardFooter>
    </Card>
  )
}

export default TvItem

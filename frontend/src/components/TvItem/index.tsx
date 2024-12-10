import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Card, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuItem, DropdownMenuPortal, DropdownMenuContent, DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuSub, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import UserWatchlistsDropdown from '@/components/WatchlistItem/UserWatchlistsDropdown'
import { Ellipsis, CirclePlus, Trash2 } from 'lucide-react'
import { TvData } from '@/types/TvTypes'
import { WatchlistData } from '@/types/WatchlistTypes'
import { generatePosterLink } from '@/utils/generateImgLinks'

interface TvItemProps {
  tv: TvData
  currentWatchlist?: WatchlistData
  inWatchlist?: boolean
  handleRemoveFromWatchlist?: (watchlistId: number, mediaType: string, itemId: number) => Promise<void>
}

const TvItem = ({ tv, currentWatchlist, inWatchlist, handleRemoveFromWatchlist }: TvItemProps) => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const [posterLink, setPosterLink] = useState(() => generatePosterLink(tv.poster_path))

  const handlePosterError = () => {
    setPosterLink("https://placehold.co/400x600?text=Poster+Unavailable&font=lato")
  }

  const fetchUserWatchlists = async () => {
    const response = await axiosPrivate.get(`/watchlists/user/${auth.id}`)
    return response.data as WatchlistData[]
  }

  const { data: userWatchlists, isLoading } = useQuery({ queryKey: ['userWatchlists'], queryFn: fetchUserWatchlists, enabled: !!auth.id })

  return (
    <Card className="overflow-hidden relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='absolute right-2 top-2'>
          <Button className='p-0 w-6 h-6 rounded-full bg-white hover:bg-white shadow'>
            <Ellipsis color='#000000' size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {
            inWatchlist ?
              (
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger disabled={!userWatchlists || isLoading || userWatchlists.length === 0} className='flex'>
                      <CirclePlus className='mr-2' />
                      Add to Watchlist
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {
                          // Render User Watchlists Here
                          userWatchlists &&
                          <UserWatchlistsDropdown userWatchlists={userWatchlists} tv={tv} />
                        }
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem className='flex' onClick={() => handleRemoveFromWatchlist!(currentWatchlist!.id, "tv", tv.id)}>
                    <Trash2 className='mr-2' />
                    Remove from Watchlist
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) :
              (
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger disabled={!userWatchlists || isLoading || userWatchlists.length === 0} className='flex'>
                      <CirclePlus className='mr-2' />
                      Add to Watchlist
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {
                          // Render User Watchlists Here
                          userWatchlists &&
                          <UserWatchlistsDropdown userWatchlists={userWatchlists} tv={tv} />
                        }
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              )
          }
        </DropdownMenuContent>
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

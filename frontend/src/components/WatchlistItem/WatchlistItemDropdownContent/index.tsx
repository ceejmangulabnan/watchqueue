import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuItem, DropdownMenuSubContent } from '@/components/ui/dropdown-menu'
import { CirclePlus, Trash2 } from 'lucide-react'
import { WatchlistData } from '@/types/WatchlistTypes'
import useFetchWatchlists from '@/hooks/useFetchWatchlists'
import UserWatchlistsDropdown from '@/components/WatchlistItem/UserWatchlistsDropdown'
import { TvDetails } from '@/types/TvTypes'
import { MovieDetails } from '@/types/MovieTypes'

interface WatchlistItemDropdownContentProps {
  inWatchlist: boolean
  currentWatchlist: WatchlistData | undefined
  mediaType: 'movie' | 'tv'
  itemDetails: MovieDetails | TvDetails
  handleRemoveFromWatchlist: (watchlistId: number, mediaType: string, itemId: number) => Promise<void>
}

const WatchlistItemDropdownContent = ({ inWatchlist, currentWatchlist, mediaType, itemDetails, handleRemoveFromWatchlist }: WatchlistItemDropdownContentProps) => {
  const { userWatchlists, isLoading } = useFetchWatchlists()
  console.log(userWatchlists)
  return (
    <DropdownMenuContent className='w-[14rem]' side={"right"}>
      {
        inWatchlist
          ? (
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={!userWatchlists || isLoading || userWatchlists.length === 0} className='flex'>
                  <CirclePlus className='mr-2' />
                  Add to Watchlist
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {
                      userWatchlists && (
                        mediaType === 'movie' ?
                          <UserWatchlistsDropdown userWatchlists={userWatchlists} movie={itemDetails as MovieDetails} />
                          : <UserWatchlistsDropdown userWatchlists={userWatchlists} tv={itemDetails as TvDetails} />
                      )
                    }
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem className='flex' onClick={() => handleRemoveFromWatchlist!(currentWatchlist!.id, mediaType, itemDetails.id)}>
                <Trash2 className='mr-2' />
                Remove from Watchlist
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )
          : (
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={!userWatchlists || isLoading || userWatchlists.length === 0} className='flex'>
                  <CirclePlus className='mr-2' />
                  Add to Watchlist
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {
                      userWatchlists && (
                        mediaType === 'movie' ?
                          <UserWatchlistsDropdown userWatchlists={userWatchlists} movie={itemDetails as MovieDetails} />
                          : <UserWatchlistsDropdown userWatchlists={userWatchlists} tv={itemDetails as TvDetails} />
                      )
                    }
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          )
      }
    </DropdownMenuContent >
  )
}

export default WatchlistItemDropdownContent
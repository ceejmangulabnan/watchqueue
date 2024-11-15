import { useQuery } from '@tanstack/react-query'
import { generatePosterLink } from "@/utils/generateImgLinks"
import { Card, CardDescription, CardTitle, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuPortal, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useAuth } from '@/hooks/useAuth'
import { WatchlistItemData } from '@/types/WatchlistTypes'
import { MovieData } from "@/types/MovieTypes"
import { Ellipsis, CirclePlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import UserWatchlistsDropdown from '@/components/WatchlistItem/UserWatchlistsDropdown'

interface MovieItemProps {
  movie: MovieData
}

const MovieItem = ({ movie }: MovieItemProps) => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const navigate = useNavigate()

  const fetchUserWatchlists = async () => {
    const response = await axiosPrivate.get(`/watchlists/user/${auth.id}`)
    return response.data as WatchlistItemData[]
  }

  const { data: userWatchlists, isLoading } = useQuery({ queryKey: ['userWatchlists'], queryFn: fetchUserWatchlists })

  return (
    <Card className="overflow-hidden relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='absolute right-2 top-2'>
          <Button className='p-0 w-6 h-6 rounded-full bg-white hover:bg-white shadow'>
            <Ellipsis color='#000000' size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[12rem]' side={"right"}>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={!userWatchlists || isLoading || userWatchlists.length === 0} className='flex'>
                <CirclePlus className='mr-2' />
                Add to Watchlist
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {
                    userWatchlists &&
                    <UserWatchlistsDropdown userWatchlists={userWatchlists} movie={movie} />
                  }
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <img onClick={() => navigate(`/movie/${movie.id}`)} src={generatePosterLink(movie.poster_path)} />
      <CardFooter className="flex-col items-start p-4">
        <CardTitle className='text-sm md:text-md truncate w-full'>{movie.title}</CardTitle>
        <CardDescription className='text-xs md:text-sm lg:text-md'>{movie.release_date.slice(0, 4)}</CardDescription>
      </CardFooter>
    </Card >
  )
}

export default MovieItem

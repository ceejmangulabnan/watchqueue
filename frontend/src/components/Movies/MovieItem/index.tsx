import { useQuery } from '@tanstack/react-query'
import { generatePosterLink } from "@/utils/generateImgLinks"
import { Card, CardDescription, CardTitle, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useAuth } from '@/hooks/useAuth'
import { WatchlistItemData } from '@/types/WatchlistTypes'
import { MovieData } from "@/types/MovieTypes"
import { Ellipsis, CirclePlus } from 'lucide-react'

interface MovieItemProps {
  movie: MovieData
}

const MovieItem = ({ movie }: MovieItemProps) => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()

  const fetchUserWatchlists = async () => {
    const response = await axiosPrivate.get(`/watchlists/user/${auth.id}`)
    return response.data as WatchlistItemData[]
  }

  const { data: userWatchlists } = useQuery({ queryKey: ['userWatchlists'], queryFn: fetchUserWatchlists })


  return (
    <Card className="overflow-hidden relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='absolute right-2 top-2'>
          <Button className='p-0 w-6 h-6 rounded-full bg-white hover:bg-white shadow'>
            <Ellipsis color='#000000' size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[12rem]'>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='flex'>
                <CirclePlus className='mr-2' />
                Add to Watchlist
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {
                    /* Map over user watchlists */
                    userWatchlists &&
                    userWatchlists.map(watchlist => (
                      <DropdownMenuItem>{watchlist.title}</DropdownMenuItem>
                    ))
                  }
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <img src={generatePosterLink(movie.poster_path)} />
      <CardFooter className="flex-col items-start p-4">
        <CardTitle>{movie.title}</CardTitle>
        <CardDescription>{movie.release_date}</CardDescription>
      </CardFooter>
    </Card>
  )
}

export default MovieItem

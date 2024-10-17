import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { generatePosterLink } from "@/utils/generateImgLinks"
import { Card, CardDescription, CardTitle, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { WatchlistItemData } from '@/types/WatchlistTypes'
import { MovieData } from "@/types/MovieTypes"
import { Ellipsis, CirclePlus } from 'lucide-react'
import { AxiosError } from 'axios'

interface MovieItemProps {
  movie: MovieData
}

const MovieItem = ({ movie }: MovieItemProps) => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const fetchUserWatchlists = async () => {
    const response = await axiosPrivate.get(`/watchlists/user/${auth.id}`)
    return response.data as WatchlistItemData[]
  }

  const { data: userWatchlists, isLoading } = useQuery({ queryKey: ['userWatchlists'], queryFn: fetchUserWatchlists })

  const addToWatchlist = async ({ watchlistId, movieId }: { watchlistId: number, movieId: number }) => {
    const response = await axiosPrivate.post(`/watchlists/${watchlistId}/add`, { movie_id: movieId })
    return response.data
  }

  const mutation = useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userWatchlists'] }),
        toast({
          title: "Success",
          description: `Movie "${movie.title}" has been added to your watchlist.`,
          variant: "success",
        })
    },
    onError: (error: AxiosError) => {
      // 409 Conflict means movie item is already in watchlist
      if (error.response?.status === 409) {
        toast({
          title: "Duplicate",
          description: "Movie is already in the watchlist.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add the movie to the watchlist.",
          variant: "destructive",
        })
      }
    }
  })

  const handleAddToWatchlist = (watchlistId: number) => {
    mutation.mutate({ watchlistId, movieId: movie.id })
  }

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
              <DropdownMenuSubTrigger disabled={!userWatchlists || isLoading || userWatchlists.length === 0} className='flex'>
                <CirclePlus className='mr-2' />
                Add to Watchlist
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {
                    /* Map over user watchlists */
                    userWatchlists &&
                    userWatchlists.map(watchlist => (
                      <DropdownMenuItem key={watchlist.id} onClick={() => handleAddToWatchlist(watchlist.id)}>
                        {watchlist.title}
                      </DropdownMenuItem>
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
      <Toaster></Toaster>
    </Card>
  )
}

export default MovieItem

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { WatchlistItemData } from '@/types/WatchlistTypes'
import { useToast } from '@/hooks/use-toast'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { MovieData, MovieDetails } from '@/types/MovieTypes'
import { AxiosError } from 'axios'

interface UserWatchlistsDropdownProps {
  userWatchlists: WatchlistItemData[]
  movie: MovieData | MovieDetails
}

const UserWatchlistsDropdown = ({ userWatchlists, movie }: UserWatchlistsDropdownProps) => {

  const { toast } = useToast()
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

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
    <div>
      {
        userWatchlists &&
        userWatchlists.map(watchlist => (
          <DropdownMenuItem className='text-md max-w-[150px]' key={watchlist.id} onClick={() => handleAddToWatchlist(watchlist.id)}>
            {watchlist.title}
          </DropdownMenuItem>
        ))
      }
    </div>
  )
}

export default UserWatchlistsDropdown


import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { WatchlistData } from '@/types/WatchlistTypes'
import { useToast } from '@/hooks/use-toast'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { MovieData, MovieDetails } from '@/types/MovieTypes'
import { TvDetails, TvData } from '@/types/TvTypes'
import { AxiosError } from 'axios'

interface UserWatchlistsDropdownProps {
  userWatchlists: WatchlistData[]
  movie?: MovieData | MovieDetails
  tv?: TvData | TvDetails
}

const UserWatchlistsDropdown = ({ userWatchlists, movie, tv }: UserWatchlistsDropdownProps) => {
  const { toast } = useToast()
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mediaType = () => movie ? "movie" : "tv"
  const mediaTitle = () => movie ? movie.title : tv?.name

  const addToWatchlist = async ({ watchlistId, itemId }: { watchlistId: number, itemId: number }) => {
    const response = await axiosPrivate.post(`/watchlists/${watchlistId}/add`, { id: itemId, media_type: mediaType(), status: 'queued', tags: [] })
    return response.data
  }

  const mutation = useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userWatchlists'] }),
        toast({
          title: "Success",
          description: `"${mediaTitle()}" has been added to your watchlist.`,
          variant: "success",
        })
    },
    onError: (error: AxiosError) => {
      // 409 Conflict means movie item is already in watchlist
      if (error.response?.status === 409) {
        toast({
          title: "Duplicate",
          description: `${mediaTitle()} is already in the watchlist.`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: `Failed to add "${mediaTitle()}" to the watchlist.`,
          variant: "destructive",
        })
      }
    }
  })

  const handleAddToWatchlist = (watchlistId: number) => {
    if (movie?.id) {
      mutation.mutate({ watchlistId, itemId: movie.id })
    } else if (tv?.id) {
      mutation.mutate({ watchlistId, itemId: tv.id })
    }
  }

  return (
    <div className='text-sm md:text-base'>
      {
        userWatchlists &&
        userWatchlists.map(watchlist => (
          <DropdownMenuItem className='text-sm md:text-base max-w-[150px]' key={watchlist.id} onClick={() => handleAddToWatchlist(watchlist.id)}>
            {watchlist.title}
          </DropdownMenuItem>
        ))
      }
    </div>
  )
}

export default UserWatchlistsDropdown


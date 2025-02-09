import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Dialog, DialogTrigger, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { WatchlistData } from '@/types/WatchlistTypes'
import { useToast } from '@/hooks/use-toast'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserWatchlists } from '@/hooks/useUserWatchlists'
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
  const [watchlistTitle, setWatchlistTitle] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { refetchUserWatchlists } = useUserWatchlists()

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axiosPrivate.post('/watchlists/create', { "title": watchlistTitle })
      if (response.status === 200) {
        refetchUserWatchlists()
        setIsOpen(false)
      }

    } catch (e) {
      console.log(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWatchlistTitle(e.target.value)
  }

  return (
    <div className='text-sm md:text-base'>
      {
        !userWatchlists.length ? (
          <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant={"secondary"} className='text-sm md:text-base'>Create Watchlist</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Watchlist</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='flex flex-col gap-y-3 mt-4'>
                  <Label htmlFor="watchlist-title">Watchlist Title</Label>
                  <Input id="watchlist-title" value={watchlistTitle} onChange={handleChange} placeholder='Watchlist Title' />
                  <Button type="submit" className='w-full'>Create</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          userWatchlists &&
          userWatchlists.map(watchlist => (
            <DropdownMenuItem className='text-sm md:text-base max-w-[150px]' key={watchlist.id} onClick={() => handleAddToWatchlist(watchlist.id)}>
              {watchlist.title}
            </DropdownMenuItem>
          ))

        )
      }
    </div>
  )
}

export default UserWatchlistsDropdown


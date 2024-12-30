import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuGroup } from '@/components/ui/dropdown-menu'
import { WatchlistItemProps } from '@/types/WatchlistTypes'
import { Card, CardFooter, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'

const WatchlistItem = ({ watchlist, handleDelete }: WatchlistItemProps) => {
  const navigate = useNavigate()
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const { data: watchlistCover, isLoading, isError } = useQuery({
    queryKey: ['watchlistCover', watchlist.id],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/watchlists/${watchlist.id}/cover_image`, { responseType: 'blob' })
      return URL.createObjectURL(response.data)
    }
  })

  // Handle image loading failure (in case the image is invalid or not found)
  const handleImageError = () => {
    console.error('Failed to load image.')
  }

  const handleClick = () => {
    navigate(`/${auth.username}/watchlist/${watchlist.id}`)
  }

  return (
    <Card onClick={handleClick} className="overflow-hidden relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='absolute right-2 top-2'>
          <Button className='p-0 w-6 h-6 rounded-full bg-white hover:bg-white shadow'>
            <Ellipsis color='#000000' size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[10rem]'>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Pencil color="#000000" size={20} className='mr-2' />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem className='text-red-500' onClick={() => handleDelete(watchlist.id)}>
              <Trash2 color="red" size={20} className='mr-2' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Handle loading, error, and the image */}
      {isLoading ? (
        <div className="w-full h-full bg-gray-200 flex justify-center items-center">
          <span>Loading...</span> {/* Optionally show a loading indicator */}
        </div>
      ) : isError ? (
        <div className="w-full h-full bg-gray-200 flex justify-center items-center">
          <span>Failed to load cover image</span> {/* Optionally show an error message */}
        </div>
      ) : (
        <img
          src={watchlistCover || 'https://placehold.co/400x600?text=Poster+Unavailable&font=lato'}
          alt="Watchlist Cover"
          loading='lazy'
          onError={handleImageError}  // Handle any image loading issues
        />
      )}
      <CardFooter className="flex-col items-start p-4">
        <CardTitle className='text-sm md:text-base font-medium'>{watchlist.title}</CardTitle>
      </CardFooter>
    </Card>
  )
}

export default WatchlistItem

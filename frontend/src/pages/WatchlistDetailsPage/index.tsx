import { useParams } from 'react-router-dom'
import { useQuery, useQueries } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { WatchlistItemData } from '@/types/WatchlistTypes'
import { MovieData } from '@/types/MovieTypes'
import MovieItem from '@/components/Movies/MovieItem'

const WatchlistDetailsPage = () => {
  const { watchlistId } = useParams()
  const axiosPrivate = useAxiosPrivate()

  const fetchWatchlistDetails = async () => {
    const response = await axiosPrivate.get(`/watchlists/${watchlistId}`)
    return response.data as WatchlistItemData
  }

  const fetchWatchlistItemDetails = async (movieId: number) => {
    const response = await axiosPrivate.get(`/movies/${movieId}`)
    return response.data as MovieData
  }

  const { data: watchlistDetails } = useQuery({ queryKey: ['watchlistDetails'], queryFn: fetchWatchlistDetails })

  const watchlistItemsDetails = useQueries({
    queries: watchlistDetails ? watchlistDetails?.items.map(movieId => ({
      queryKey: ["watchlistItemDetails", movieId],
      queryFn: () => fetchWatchlistItemDetails(movieId),
      enabled: watchlistDetails.items.length > 0
    }))
      : []
  })

  return (
    <div className='mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]'>
      <h3 className="text-xl font-semibold py-4">{watchlistDetails?.title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {
          watchlistItemsDetails.map(movieDetails => (
            movieDetails.data ?
              <MovieItem movie={movieDetails.data} />
              : null
          ))
        }
      </div>
    </div>
  )
}

export default WatchlistDetailsPage

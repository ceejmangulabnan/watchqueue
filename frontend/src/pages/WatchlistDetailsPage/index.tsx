import { useParams } from 'react-router-dom'
import { useQuery, useQueries } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { WatchlistItemData } from '@/types/WatchlistTypes'
import { MovieData } from '@/types/MovieTypes'
import MovieItem from '@/components/Movies/MovieItem'


const WatchlistDetailsPage = () => {
  const { watchlistId, username } = useParams()
  const axiosPrivate = useAxiosPrivate()
  console.log("watchlist ID: ", watchlistId, username)

  const fetchWatchlistDetails = async () => {
    const response = await axiosPrivate.get(`/watchlists/${watchlistId}`)
    return response.data as WatchlistItemData
  }

  const { data: watchlistDetails } = useQuery({ queryKey: ['watchlistDetails'], queryFn: fetchWatchlistDetails })

  const fetchWatchlistItemDetails = async (movieId: number) => {
    const response = await axiosPrivate.get(`/movies/${movieId}`)
    return response.data as MovieData
  }

  const watchlistItemsDetails = useQueries({
    queries: watchlistDetails ? watchlistDetails?.items.map(movieId => ({
      queryKey: ["watchlistItemDetails", movieId],
      queryFn: () => fetchWatchlistItemDetails(movieId),
      enabled: watchlistDetails.items.length > 0
    }))
      : []
  })

  console.log(watchlistItemsDetails)

  return (
    <div className="m-8 my-10">

      <h3 className="text-xl font-semibold py-4 ">{watchlistDetails?.title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-4">

        {
          watchlistItemsDetails &&
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

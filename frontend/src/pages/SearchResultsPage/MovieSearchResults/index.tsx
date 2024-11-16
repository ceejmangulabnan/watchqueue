import MovieItem from '@/components/Movies/MovieItem'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { MovieDataQuery } from '@/types/MovieTypes'
import { useSearchParams } from 'react-router-dom'

const MovieSearchResults = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('query')
  const axiosPrivate = useAxiosPrivate()

  const fetchSearchMovie = async () => {
    const response = await axiosPrivate.get(`/search/movie?query=${searchQuery}`)
    return response.data as MovieDataQuery
  }

  const { data: movieSearchResults } = useQuery({
    queryKey: ["movieSearchResults", searchQuery],
    queryFn: fetchSearchMovie,
  })
  return (
    <div className='my-4'>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {
          movieSearchResults && (
            movieSearchResults.results.map(movie => (
              <MovieItem movie={movie} />
            ))
          )
        }
      </div>

    </div>
  )
}

export default MovieSearchResults

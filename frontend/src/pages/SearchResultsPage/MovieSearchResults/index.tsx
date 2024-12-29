import { useSearchParams } from 'react-router-dom'
import MovieItem from '@/components/Movies/MovieItem'
import { MovieData } from '@/types/MovieTypes'
import useSearchResults from '@/hooks/useSearchResults'

const MovieSearchResults = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('query')
  const { data: movieSearchResults } = useSearchResults(searchQuery, `/search/movie?query=${searchQuery}`, 'movieSearchResults')

  return (
    <div className='my-4'>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {
          movieSearchResults && (
            movieSearchResults.results.map((movie: MovieData) => (
              <MovieItem movie={movie} />
            ))
          )
        }
      </div>

    </div>
  )
}

export default MovieSearchResults

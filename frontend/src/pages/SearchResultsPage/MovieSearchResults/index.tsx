import { useSearchParams } from 'react-router-dom'
import MovieItem from '@/components/Movies/MovieItem'
import { MovieDataQuery } from '@/types/MovieTypes'
import useSearchResults from '@/hooks/useSearchResults'
import SearchResultsPagination from '@/components/SearchResultsPagination'

const MovieSearchResults = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('query')
  const pageParams = searchParams.get('page')
  const { data: movieSearchResults } = useSearchResults<MovieDataQuery>(
    searchQuery,
    pageParams,
    `/search/movie?query=${searchQuery}&page=${pageParams}`,
    'movieSearchResults')

  return (
    <div className='my-4'>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
        {
          movieSearchResults && (
            movieSearchResults.results.map((movie) => (
              <MovieItem key={movie.id} movie={movie} />
            ))
          )
        }
      </div>
      <SearchResultsPagination totalPages={movieSearchResults?.total_pages} />
    </div>
  )
}

export default MovieSearchResults

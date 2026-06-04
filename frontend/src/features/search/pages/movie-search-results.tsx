import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import MovieItem from '@/features/movies/components/movie-item'
import { MovieDataQuery } from '@/features/movies/types/movie-types'
import useSearchResults from '@/features/search/hooks/use-search-results'
import SearchResultsPagination from '@/features/search/components/search-results-pagination'

const MovieSearchResults = () => {
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('query')
    const pageParams = searchParams.get('page')
    const { data: movieSearchResults } = useSearchResults<MovieDataQuery>(
        searchQuery,
        pageParams,
        `/search/movie?query=${searchQuery}&page=${pageParams}`,
        'movieSearchResults'
    )

    return (
        <>
        <Helmet>
            <title>Movie Results: {searchQuery} - WatchQueue</title>
        </Helmet>
        <div className="my-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                {movieSearchResults &&
                    movieSearchResults.results.map((movie) => (
                        <MovieItem key={movie.id} movie={movie} />
                    ))}
            </div>
            <SearchResultsPagination
                totalPages={movieSearchResults?.total_pages}
            />
        </div>
        </>
    )
}

export default MovieSearchResults

import { useSearchParams } from 'react-router-dom'
import TvItem from '@/components/TvItem'
import MovieItem from '@/components/Movies/MovieItem'
import PersonItem from '@/components/PersonItem'
import { MediaData, MediaDataQuery } from '@/types/MediaTypes'
import useSearchResults from '@/hooks/useSearchResults'
import SearchResultsPagination from '@/components/SearchResultsPagination'

// Render corresponding item to media type 
const MultiSearchResults = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('query')
  const pageParams = searchParams.get('page')
  const { data: multiSearchResults } = useSearchResults<MediaDataQuery>(
    searchQuery,
    pageParams,
    `/search/multi?query=${searchQuery}&page=${pageParams}`,
    'multiSearchResults'
  )

  console.log(multiSearchResults)
  return (
    <div className='my-4'>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
        {multiSearchResults &&
          multiSearchResults.results.map((media: MediaData) =>
            media.media_type === 'movie' ? (
              <MovieItem key={media.id} movie={media} />
            ) : media.media_type === 'tv' ? (
              <TvItem key={media.id} tv={media} />
            ) : media.media_type === 'person' ? (
              <PersonItem key={media.id} person={media} />
            ) : null
          )}
      </div>
      <SearchResultsPagination totalPages={multiSearchResults?.total_pages} />
    </div>
  )
}

export default MultiSearchResults

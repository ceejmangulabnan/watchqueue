import { useSearchParams } from 'react-router-dom'
import TvItem from '@/components/TvItem'
import MovieItem from '@/components/Movies/MovieItem'
import PersonItem from '@/components/PersonItem'
import { MediaData } from '@/types/MediaTypes'
import useSearchResults from '@/hooks/useSearchResults'

// Render corresponding item to media type 
const MultiSearchResults = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('query')
  const { data: multiSearchResults } = useSearchResults(searchQuery, `/search/multi?query=${searchQuery}`, 'multiSearchResults')

  return (
    <div className='my-4'>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
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
    </div>
  )
}

export default MultiSearchResults

import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import TvItem from '@/components/TvItem'
import MovieItem from '@/components/Movies/MovieItem'
import PersonItem from '@/components/PersonItem'
import { MediaDataQuery } from '@/types/MediaTypes'

// Render corresponding item to media type 
const MultiSearchResults = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('query')
  const axiosPrivate = useAxiosPrivate()

  const fetchSearchMulti = async () => {
    const response = await axiosPrivate.get(`/search/multi?query=${searchQuery}`)
    return response.data as MediaDataQuery
  }

  const { data: multiSearchResults } = useQuery({
    queryKey: ["multiSearchResults", searchQuery],
    queryFn: fetchSearchMulti
  })

  return (
    <div className='my-4'>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {
          multiSearchResults && (
            multiSearchResults.results.map(media => {
              switch (media.media_type) {
                case "movie":
                  return (
                    <MovieItem key={media.id} movie={media} />
                  )
                case "tv":
                  return (
                    <TvItem key={media.id} tv={media} />
                  )
                case "person":
                  return (
                    <PersonItem key={media.id} person={media} />
                  )
                default:
                  return null
              }
            })
          )
        }
      </div>
    </div>
  )
}

export default MultiSearchResults

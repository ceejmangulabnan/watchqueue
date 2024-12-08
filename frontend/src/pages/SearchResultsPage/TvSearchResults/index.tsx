import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { TvDataQuery } from '@/types/TvTypes'
import TvItem from '@/components/TvItem'

const TvSearchResults = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('query')
  const axiosPrivate = useAxiosPrivate()

  const fetchSearchTv = async () => {
    const response = await axiosPrivate.get(`/search/tv?query=${searchQuery}`)
    return response.data as TvDataQuery
  }

  const { data: tvSearchResults } = useQuery({
    queryKey: ["tvSearchResults", searchQuery],
    queryFn: fetchSearchTv,
  })

  return (
    <div className='my-4'>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {
          tvSearchResults && (
            tvSearchResults.results.map(tv => (
              <TvItem key={tv.id} tv={tv} />
            ))
          )
        }
      </div>
    </div>
  )
}

export default TvSearchResults

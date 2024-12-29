import { useSearchParams } from 'react-router-dom'
import { TvData } from '@/types/TvTypes'
import TvItem from '@/components/TvItem'
import useSearchResults from '@/hooks/useSearchResults'

const TvSearchResults = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('query')
  const { data: tvSearchResults } = useSearchResults(searchQuery, `/search/tv?query=${searchQuery}`, 'tvSearchResults')

  return (
    <div className='my-4'>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {
          tvSearchResults && (
            tvSearchResults.results.map((tv: TvData) => (
              <TvItem key={tv.id} tv={tv} />
            ))
          )
        }
      </div>
    </div>
  )
}

export default TvSearchResults

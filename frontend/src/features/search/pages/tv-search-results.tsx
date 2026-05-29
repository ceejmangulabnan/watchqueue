import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { TvDataQuery } from '@/features/tv/types/tv-types'
import TvItem from '@/features/tv/components/tv-item'
import useSearchResults from '@/features/search/hooks/use-search-results'
import SearchResultsPagination from '@/features/search/components/search-results-pagination'

const TvSearchResults = () => {
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('query')
    const pageParams = searchParams.get('page')
    const { data: tvSearchResults } = useSearchResults<TvDataQuery>(
        searchQuery,
        pageParams,
        `/search/tv?query=${searchQuery}`,
        'tvSearchResults'
    )

    return (
        <>
        <Helmet>
            <title>TV Results: {searchQuery} - WatchQueue</title>
        </Helmet>
        <div className="my-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                {tvSearchResults &&
                    tvSearchResults.results.map((tv) => (
                        <TvItem key={tv.id} tv={tv} />
                    ))}
            </div>
            <SearchResultsPagination
                totalPages={tvSearchResults?.total_pages}
            />
        </div>
        </>
    )
}

export default TvSearchResults

import { useQuery } from '@tanstack/react-query'
import axiosBase from '@/api/axios'
import { MovieDataQuery } from '@/features/movies/types/movie-types'
import ScrollableList from '@/features/common/components/scrollable-list'

const TopRatedMovies = () => {
    const fetchTopRatedMovies = async () => {
        const response = await axiosBase.get('/movies/popular')
        return response.data as MovieDataQuery
    }

    const { data: topRatedMovies, isLoading } = useQuery({
        queryKey: ['topRateMovies'],
        queryFn: fetchTopRatedMovies,
    })

    return (
        <div className="mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]">
            <h3 className="text-base md:text-2xl font-semibold">
                Top Rated Movies
            </h3>
            <ScrollableList
                scrollableItems={topRatedMovies!}
                isDataLoading={isLoading}
            />
        </div>
    )
}

export default TopRatedMovies

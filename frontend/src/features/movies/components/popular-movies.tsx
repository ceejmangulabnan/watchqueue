import { useQuery } from '@tanstack/react-query'
import axiosBase from '@/api/axios'
import { MovieDataQuery } from '@/features/movies/types/movie-types'
import ScrollableList from '@/features/common/components/scrollable-list'

const PopularMovies = () => {
    const fetchPopularMovies = async () => {
        const response = await axiosBase.get('/movies/popular')
        return response.data as MovieDataQuery
    }

    const { data: popularMovies, isLoading } = useQuery({
        queryKey: ['popularMovies'],
        queryFn: fetchPopularMovies,
    })

    return (
        <div className="mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]">
            <h3 className="text-base md:text-xl font-semibold py-4 ">
                Popular Movies
            </h3>
            <ScrollableList
                scrollableItems={popularMovies!}
                isDataLoading={isLoading}
            />
        </div>
    )
}

export default PopularMovies

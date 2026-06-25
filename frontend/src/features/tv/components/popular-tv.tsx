import { useQuery } from '@tanstack/react-query'
import axiosBase from '@/api/axios'
import ScrollableList from '@/features/common/components/scrollable-list'
import { TvDataQuery } from '../types/tv-types'

const PopularTv = () => {
    const fetchPopularTv = async () => {
        const response = await axiosBase.get('/tv/popular')
        return response.data as TvDataQuery
    }

    const { data: popularTv, isLoading } = useQuery({
        queryKey: ['popularTv'],
        queryFn: fetchPopularTv,
    })

    return (
        <div className="mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px] group">
            <h3 className="text-base md:text-2xl font-semibold transition-transform duration-300 ease-in-out group-hover:translate-x-2 before:content-[''] before:inline-block before:w-1 before:h-5 before:bg-red-500 before:mr-2 before:align-middle">Popular TV</h3>
            <ScrollableList
                scrollableItems={popularTv!}
                isDataLoading={isLoading}
            />
        </div>
    )
}

export default PopularTv

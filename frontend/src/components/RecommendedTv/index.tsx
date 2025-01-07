import axiosBase from '@/api/axios'
import { TvDetails, RecommendedTvData } from '@/types/TvTypes'
import { useQuery } from '@tanstack/react-query'
import TvItem from '@/components/TvItem'

interface RecommendedTvProps {
  tvDetails: TvDetails
}

const RecommendedTv = ({ tvDetails }: RecommendedTvProps) => {

  const fetchRecommendedTv = async () => {
    const response = await axiosBase.get(`/tv/${tvDetails.id}/recommendations`)
    return response.data as RecommendedTvData
  }

  const { data: recommendedTv } = useQuery({ queryKey: ['recommendedTv', tvDetails.id], queryFn: fetchRecommendedTv })

  return (
    <div>
      <h3 className='text-xl font-semibold py-4'>Recommended TV Shows</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8  gap-4">
        {recommendedTv && (
          recommendedTv.results.slice(0, 8).map(tv => (
            <TvItem key={tv.id} tv={tv} />
          ))
        )}
      </div>
    </div>
  )
}

export default RecommendedTv

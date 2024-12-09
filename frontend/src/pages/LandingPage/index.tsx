import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { MovieDataQuery } from '@/types/MovieTypes'
import { TvDataQuery } from '@/types/TvTypes'
import ScrollableList from '@/components/ScrollableList'

const LandingPage = () => {
  const axiosPrivate = useAxiosPrivate()

  const fetchPopularMovies = async () => {
    const response = await axiosPrivate.get('/movies/popular')
    return response.data as MovieDataQuery
  }

  const { data: popularMovies, isLoading: isPopularMoviesLoading } = useQuery({ queryKey: ['popularMovies'], queryFn: fetchPopularMovies })

  const fetchPopularTv = async () => {
    const response = await axiosPrivate.get('/tv/popular')
    return response.data as TvDataQuery
  }

  const { data: popularTv, isLoading: isPopularTvLoading } = useQuery({ queryKey: ['popularTv'], queryFn: fetchPopularTv })

  return (
    <div className='mx-10 md:mx-20 my-10'>
      <div className='mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]'>
        <h3 className="text-base md:text-xl font-semibold py-4 ">Popular Movies</h3>
        {(popularMovies && !isPopularMoviesLoading) &&
          <ScrollableList scrollableItems={popularMovies} isDataLoading={isPopularMoviesLoading} />}

        <h3 className="text-base md:text-xl font-semibold py-4 ">Popular TV Shows</h3>
        {(popularTv && !isPopularTvLoading) &&
          <ScrollableList scrollableItems={popularTv} isDataLoading={isPopularTvLoading} />}
      </div>
    </div>
  )
}

export default LandingPage

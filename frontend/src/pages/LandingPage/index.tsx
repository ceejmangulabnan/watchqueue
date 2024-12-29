import { useQuery } from '@tanstack/react-query'
import axiosBase from '@/api/axios'
import { MovieDataQuery } from '@/types/MovieTypes'
import { TvDataQuery } from '@/types/TvTypes'
import ScrollableList from '@/components/ScrollableList'

const LandingPage = () => {
  const fetchMoviePopular = async () => {
    const response = await axiosBase.get('/movies/popular')
    return response.data as MovieDataQuery
  }

  const { data: moviePopular, isLoading: isMoviePopularLoading } = useQuery({ queryKey: ['moviePopular'], queryFn: fetchMoviePopular })

  const fetchMovieTopRated = async () => {
    const response = await axiosBase.get('/movies/top_rated')
    return response.data as MovieDataQuery
  }

  const { data: movieTopRated, isLoading: isMovieTopRatedLoading } = useQuery({ queryKey: ['movieTopRated'], queryFn: fetchMovieTopRated })

  const fetchTvPopular = async () => {
    const response = await axiosBase.get('/tv/popular')
    return response.data as TvDataQuery
  }

  const { data: tvPopular, isLoading: isTvPopularLoading } = useQuery({ queryKey: ['tvPopular'], queryFn: fetchTvPopular })

  const fetchTvTopRated = async () => {
    const response = await axiosBase.get('/tv/top_rated')
    return response.data as TvDataQuery
  }

  const { data: tvTopRated, isLoading: isTvTopRatedLoading } = useQuery({ queryKey: ['tvTopRated'], queryFn: fetchTvTopRated })


  return (
    <div className='mx-10 md:mx-20 my-10'>
      <div className='mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]'>
        <h3 className="text-base md:text-xl font-semibold py-4 ">Popular Movies</h3>
        {(moviePopular && !isMoviePopularLoading) &&
          <ScrollableList scrollableItems={moviePopular} isDataLoading={isMoviePopularLoading} />}

        <h3 className="text-base md:text-xl font-semibold py-4 ">Top Rated Movies</h3>
        {(movieTopRated && !isMovieTopRatedLoading) &&
          <ScrollableList scrollableItems={movieTopRated} isDataLoading={isMovieTopRatedLoading} />}

        <h3 className="text-base md:text-xl font-semibold py-4 ">Popular TV Shows</h3>
        {(tvPopular && !isTvPopularLoading) &&
          <ScrollableList scrollableItems={tvPopular} isDataLoading={isTvPopularLoading} />}

        <h3 className="text-base md:text-xl font-semibold py-4 ">Top Rated TV Shows</h3>
        {(tvTopRated && !isTvTopRatedLoading) &&
          <ScrollableList scrollableItems={tvTopRated} isDataLoading={isTvTopRatedLoading} />}
      </div>
    </div>
  )
}

export default LandingPage

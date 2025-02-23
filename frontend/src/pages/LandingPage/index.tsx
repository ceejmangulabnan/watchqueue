import ScrollableList from '@/components/ScrollableList'
import useMediaData from '@/hooks/useMediaData'

const LandingPage = () => {
  const { data: moviePopular, isLoading: isMoviePopularLoading } = useMediaData('/movies/popular', 'moviesPopular')
  const { data: movieTopRated, isLoading: isMovieTopRatedLoading } = useMediaData('/movies/top_rated', 'moviesTopRated')
  const { data: tvPopular, isLoading: isTvPopularLoading } = useMediaData('/tv/popular', 'tvPopular')
  const { data: tvTopRated, isLoading: isTvTopRatedLoading } = useMediaData('/tv/top_rated', 'tvTopRated')

  return (
    <div className='mx-10 md:mx-20 my-10'>
      <div className='mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]'>
        <h3 className="text-base md:text-xl font-semibold pt-4">Popular Movies</h3>
        {(moviePopular && !isMoviePopularLoading) &&
          <ScrollableList scrollableItems={moviePopular} isDataLoading={isMoviePopularLoading} />}

        <h3 className="text-base md:text-xl font-semibold pt-4">Top Rated Movies</h3>
        {(movieTopRated && !isMovieTopRatedLoading) &&
          <ScrollableList scrollableItems={movieTopRated} isDataLoading={isMovieTopRatedLoading} />}

        <h3 className="text-base md:text-xl font-semibold pt-4">Popular TV Shows</h3>
        {(tvPopular && !isTvPopularLoading) &&
          <ScrollableList scrollableItems={tvPopular} isDataLoading={isTvPopularLoading} />}

        <h3 className="text-base md:text-xl font-semibold pt-4">Top Rated TV Shows</h3>
        {(tvTopRated && !isTvTopRatedLoading) &&
          <ScrollableList scrollableItems={tvTopRated} isDataLoading={isTvTopRatedLoading} />}

      </div>
    </div>
  )
}

export default LandingPage

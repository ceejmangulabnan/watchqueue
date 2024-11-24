import { useQuery } from "@tanstack/react-query"
import MovieItem from "@/components/Movies/MovieItem"
import { MovieDataQuery } from "@/types/MovieTypes"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"

const PopularMovies = () => {
  const axiosPrivate = useAxiosPrivate()
  const fetchPopularMovies = async () => {
    const response = await axiosPrivate.get('/movie/popular')
    return response.data as MovieDataQuery
  }

  const { data: popularMovies } = useQuery({ queryKey: ['popularMovies'], queryFn: fetchPopularMovies })

  return (
    <div className='mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]'>
      <h3 className="text-base md:text-xl font-semibold py-4 ">Popular Movies</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {
          popularMovies?.results.map(movie => (
            <MovieItem movie={movie} key={movie.id} />
          ))
        }
      </div>

    </div>
  )
}

export default PopularMovies

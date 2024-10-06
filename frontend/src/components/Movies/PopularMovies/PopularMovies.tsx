import { useQuery } from "@tanstack/react-query"
import MovieItem from "../MovieItem"
import { MovieDataQuery } from "../../../types/MovieTypes"
import axios from "../../../api/axios"

const PopularMovies = () => {
  const fetchPopularMovies = async () => {
    const response = await axios.get('http://localhost:8000/movie/popular')
    const data = await response.data as MovieDataQuery
    return data
  }

  const { data: popularMovies } = useQuery({ queryKey: ['popularMovies'], queryFn: fetchPopularMovies })

  return (
    <div className="m-8 my-10">
      <h3 className="text-xl font-semibold py-4 ">Popular Movies</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-4">
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

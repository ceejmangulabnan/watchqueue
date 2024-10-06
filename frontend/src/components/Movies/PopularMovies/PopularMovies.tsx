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
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-4 m-8 ">
      {
        popularMovies?.results.map(movie => (
          <MovieItem movie={movie} key={movie.id} />
        ))
      }
    </div>
  )
}

export default PopularMovies

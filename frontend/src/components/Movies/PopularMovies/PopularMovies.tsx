import { useQuery } from "@tanstack/react-query"
import MovieItem from "../MovieItem"
import { MovieDataQuery } from "../../../types/MovieTypes"
import './popular-movies.scss'
import axios from "../../../api/axios"

const PopularMovies = () => {
  const fetchPopularMovies = async () => {
    const response = await axios.get('http://localhost:8000/movie/popular')
    const data = await response.data as MovieDataQuery
    return data
  }

  const popularMoviesData = useQuery({ queryKey: ['popularMovies'], queryFn: fetchPopularMovies })
  console.log(popularMoviesData.data)

  return (
    <div className="popular-movies">
      {
        popularMoviesData.data?.results.map(movie => (
          <MovieItem movie={movie} key={movie.id} />
        ))
      }
    </div>
  )
}

export default PopularMovies

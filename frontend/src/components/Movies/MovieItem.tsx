import { MovieData } from "../../types/MovieTypes"
import { generatePosterLink } from "../../utils/generateImgLinks"
import './movie_item.scss'

interface MovieItemProps {
  movie: MovieData
}

const MovieItem = ({ movie }: MovieItemProps) => {
  return (
    <div className="movie-item">
      <h2 className="movie-item__title">{movie.title}</h2>
      <img className='movie-item__poster' src={generatePosterLink(movie.poster_path)} />
    </div>
  )
}

export default MovieItem

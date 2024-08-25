import { MovieData } from "../../types/MovieTypes"
import { generatePosterLink } from "../../utils/generateImgLinks"
import './movie_item.scss'

interface MovieItemProps {
  movie: MovieData
}

const MovieItem = ({ movie }: MovieItemProps) => {
  return (
    <div className="movie-item">
      <img className='movie-item__poster' src={generatePosterLink(movie.poster_path)} />
      <h2 className="movie-item__title">{movie.title}</h2>
      <p>{movie.release_date}</p>
    </div>
  )
}

export default MovieItem

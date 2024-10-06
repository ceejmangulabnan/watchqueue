import { MovieData } from "../../types/MovieTypes"
import { generatePosterLink } from "../../utils/generateImgLinks"
import { Card, CardDescription, CardTitle, CardFooter } from "../ui/card"

interface MovieItemProps {
  movie: MovieData
}

const MovieItem = ({ movie }: MovieItemProps) => {
  return (
    <Card className="overflow-hidden">
      <img src={generatePosterLink(movie.poster_path)} />
      <CardFooter className="flex-col items-start p-4">
        <CardTitle>{movie.title}</CardTitle>
        <CardDescription>{movie.release_date}</CardDescription>
      </CardFooter>
    </Card>
  )
}

export default MovieItem

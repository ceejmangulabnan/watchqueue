import { useQuery } from '@tanstack/react-query'
import axiosBase from '@/api/axios'
import {
    MovieDetails,
    RecommendedMoviesData,
} from '@/features/movies/types/movie-types'
import MovieItem from '@/features/movies/components/movie-item'

interface RecommendedMoviesProps {
    movieDetails: MovieDetails
}

const RecommendedMovies = ({ movieDetails }: RecommendedMoviesProps) => {
    const fetchRecommendedMovies = async () => {
        const response = await axiosBase.get(
            `/movie/${movieDetails.id}/recommendations`
        )
        return response.data as RecommendedMoviesData
    }

    const { data: recommendedMovies } = useQuery({
        queryKey: ['recommendedMovies', movieDetails.id],
        queryFn: fetchRecommendedMovies,
    })

    return (
        <div>
            <h3 className="text-xl font-semibold py-4">Recommended Movies</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 2xl:grid-cols-8 gap-4">
                {recommendedMovies &&
                    recommendedMovies.results
                        .slice(0, 8)
                        .map((movie) => (
                            <MovieItem key={movie.id} movie={movie} />
                        ))}
            </div>
        </div>
    )
}

export default RecommendedMovies

import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { MovieDetails } from '@/types/MovieTypes'
import { generatePosterLink } from "@/utils/generateImgLinks"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import UserWatchlistsDropdown from '@/components/WatchlistItem/UserWatchlistsDropdown'
import { useAuth } from '@/hooks/useAuth'
import { WatchlistData } from '@/types/WatchlistTypes'
import RecommendedMovies from '@/components/RecommendedMovies'
import { useState } from 'react'

const MovieDetailsPage = () => {
  const { movieId } = useParams()
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const [posterLink, setPosterLink] = useState<string | undefined>('')

  const fetchMovieDetails = async () => {
    const response = await axiosPrivate.get(`/movies/${movieId}`)
    const data = await response.data as MovieDetails
    setPosterLink(generatePosterLink(data.poster_path))
    return data
  }

  const { data: movieDetails } = useQuery({
    queryKey: ["movieDetails", movieId],
    queryFn: fetchMovieDetails,
  })

  const fetchUserWatchlists = async () => {
    const response = await axiosPrivate.get(`/watchlists/user/${auth.id}`)
    return response.data as WatchlistData[]
  }

  const { data: userWatchlists } = useQuery({ queryKey: ['userWatchlists'], queryFn: fetchUserWatchlists })

  const handlePosterError = () => {
    setPosterLink("https://placehold.co/400x600?text=Poster+Unavailable&font=lato")
  }

  return movieDetails ? (
    <div className='mx-10 md:mx-20 my-10'>
      <div className="mx-auto py-8 xl:max-w-[1400px] 2xl:max-w-[1600px]">
        <div className='flex flex-col  items-center sm:flex-row pb-8 sm:py-8'>
          <img className='aspect-[2/3] sm:mr-8 sm:max-h-[350px] md:max-h-[400px] rounded-lg' src={posterLink} alt={movieDetails.title} onError={handlePosterError} />

          <div className='flex flex-col p-4 flex-1'>
            <div className='flex items-center flex-wrap'>
              <h3 className='text-xl md:text-3xl mr-4 font-bold font-merriweather'>{movieDetails.title}</h3>
              <h4 className='text-sm md:text-xl font-medium text-gray-500'>{movieDetails.release_date.slice(0, 4)}</h4>
            </div>
            <div className='flex mt-2 flex-wrap text-sm md:text-base'>
              <p className='mr-2'>{movieDetails.runtime} mins</p>
              <div className='flex flex-wrap gap-x-2 font-semibold'>
                {movieDetails.genres.map(genre => (
                  <p key={genre.id}>{genre.name}</p>
                ))}
              </div>
            </div>
            <div className='flex flex-col mt-4 gap-4'>
              <div>
                <p className={`mt-2 md:mt-4 tracking-wider  text-sm md:text-lg italic font-medium ${movieDetails.tagline ? '' : 'hidden'}`}>"{movieDetails.tagline}"</p>
                <p className='mt-2 text-sm md:text-lg max-w-[600px]'>{movieDetails.overview}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='max-w-[150px] md:max-w-[200px] text-sm md:text-lg '>Add to Watchlist</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side={"right"}>
                  {
                    userWatchlists &&
                    <UserWatchlistsDropdown userWatchlists={userWatchlists} movie={movieDetails} />
                  }
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </div>
        <RecommendedMovies movieDetails={movieDetails} />
      </div>
    </div>
  ) : null
}

export default MovieDetailsPage

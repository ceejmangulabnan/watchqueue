import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { MovieDetails } from '@/types/MovieTypes'
import { generatePosterLink } from "@/utils/generateImgLinks"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import UserWatchlistsDropdown from '@/components/WatchlistItem/UserWatchlistsDropdown'
import { useAuth } from '@/hooks/useAuth'
import { WatchlistItemData } from '@/types/WatchlistTypes'
import RecommendedMovies from '@/components/RecommendedMovies'
import { useState } from 'react'

const MovieDetailsPage = () => {
  const { movieId } = useParams()
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const [posterLink, setPosterLink] = useState<string | undefined>(() => generatePosterLink(movieDetails.poster_path))

  const fetchMovieDetails = async () => {
    const response = await axiosPrivate.get(`/movies/${movieId}`)
    return response.data as MovieDetails
  }

  const { data: movieDetails, isLoading, isError } = useQuery({
    queryKey: ["movieDetails", movieId],
    queryFn: fetchMovieDetails,
  })

  const fetchUserWatchlists = async () => {
    const response = await axiosPrivate.get(`/watchlists/user/${auth.id}`)
    return response.data as WatchlistItemData[]
  }

  const { data: userWatchlists } = useQuery({ queryKey: ['userWatchlists'], queryFn: fetchUserWatchlists })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error fetching movie details.</p>

  return movieDetails ? (
    <div className="mx-auto py-8 xl:max-w-[1400px] 2xl:max-w-[1600px]">
      <div className='flex py-8'>
        <img className='mr-8 max-w-[300px] rounded-lg' src={generatePosterLink(movieDetails.poster_path)} alt={movieDetails.title} />

        <div className='flex flex-col p-4'>
          <div className='flex gap-4 items-end'>
            <h3 className='text-3xl font-bold font-merriweather'>{movieDetails.title}</h3>
            <h4 className='text-xl font-medium text-gray-500'>{movieDetails.release_date.slice(0, 4)}</h4>
          </div>
          <div className='flex mt-2'>
            <p>{movieDetails.runtime} mins<span className='mx-2'>·</span></p>
            <p className='flex gap-2 font-semibold'>{movieDetails.genres.map(genre => (
              <p>{genre.name}</p>
            ))}</p>
            <p className='ml-2'>{movieDetails.id}</p>
          </div>
          <div className='flex flex-col mt-4 gap-8'>
            <div>
              <p className={`mt-4 tracking-wider text-lg italic font-medium ${movieDetails.tagline ? '' : 'hidden'}`}>"{movieDetails.tagline}"</p>
              <p className='mt-2 text-lg max-w-[600px]'>{movieDetails.overview}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='max-w-[200px] text-lg '>Add to Watchlist</Button>
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
  ) : null
}

export default MovieDetailsPage

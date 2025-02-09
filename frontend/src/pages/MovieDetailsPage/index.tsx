import { useParams } from 'react-router-dom'
import { generatePosterLink, FALLBACK_POSTER } from "@/utils"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import UserWatchlistsDropdown from '@/components/WatchlistItem/UserWatchlistsDropdown'
import RecommendedMovies from '@/components/RecommendedMovies'
import { useUserWatchlists } from '@/hooks/useUserWatchlists'
import useMediaDetails from '@/hooks/useMediaDetails'
import { Genre } from '@/types/TvTypes'
import { MovieDetails } from '@/types/MovieTypes'
import { useAuth } from '@/hooks/useAuth'
import LoginRegisterToggle from '@/components/LoginRegisterToggle'
import { useState } from 'react'

const MovieDetailsPage = () => {
  const { movieId } = useParams()
  const { userWatchlists } = useUserWatchlists()
  const { auth } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const { data: movieDetails } = useMediaDetails<MovieDetails>(movieId, `/movies/${movieId}`, 'movieDetails')

  const isAuthed = auth && !Object.values(auth).includes(null)
  const posterLink = generatePosterLink(movieDetails?.poster_path)

  return movieDetails ? (
    <div className='mx-10 md:mx-20 my-10'>
      <div className="mx-auto py-8 xl:max-w-[1400px] 2xl:max-w-[1600px]">
        <div className='flex flex-col items-center sm:flex-row pb-8 sm:py-8'>
          <img
            className='aspect-[2/3] sm:mr-8 sm:max-h-[350px] md:max-h-[400px] rounded-lg'
            loading='lazy'
            src={posterLink}
            alt={movieDetails.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_POSTER
            }}
          />

          <div className='flex flex-col p-4 flex-1'>
            <div className='flex items-center flex-wrap'>
              <h3 className='text-xl md:text-3xl mr-4 font-bold font-merriweather'>{movieDetails.title}</h3>
              <h4 className='text-sm md:text-xl font-medium text-gray-500'>{movieDetails.release_date.slice(0, 4)}</h4>
            </div>
            <div className='flex mt-2 flex-wrap text-sm md:text-base'>
              <p className='mr-2'>{movieDetails.runtime} mins</p>
              <div className='flex flex-wrap gap-x-2 font-semibold'>
                {movieDetails.genres.map((genre: Genre) => (
                  <p key={genre.id}>{genre.name}</p>
                ))}
              </div>
            </div>
            <div className='flex flex-col mt-4 gap-4'>
              <div>
                <p className={`mt-2 md:mt-4 tracking-wider  text-sm md:text-lg italic font-medium ${movieDetails.tagline ? '' : 'hidden'}`}>"{movieDetails.tagline}"</p>
                <p className='mt-2 text-sm md:text-lg max-w-[600px]'>{movieDetails.overview}</p>
              </div>
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button className='max-w-[150px] md:max-w-[200px] text-sm md:text-lg'>Add to Watchlist</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side={"right"}>
                  {
                    isAuthed ? (
                      userWatchlists &&
                      <UserWatchlistsDropdown userWatchlists={userWatchlists} movie={movieDetails} />
                    )
                      : (
                        <div className='p-4'>
                          <h1 className='font-bold text-lg'>Add to watchlist</h1>
                          <p className='py-2'>
                            Please log in to create and add movies to watchlists.
                          </p>
                          <div className='w-full flex justify-end gap-4'>
                            <Button variant={"outline"} onClick={() => setIsOpen(false)}>Not now</Button>
                            <LoginRegisterToggle />
                          </div>
                        </div>
                      )
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

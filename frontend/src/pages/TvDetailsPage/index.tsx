import { useParams } from 'react-router-dom'
import axiosBase from '@/api/axios'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { TvDetails } from '@/types/TvTypes'
import { generatePosterLink } from "@/utils/generateImgLinks"
import { useUserWatchlists } from '@/hooks/useUserWatchlists'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import UserWatchlistsDropdown from '@/components/WatchlistItem/UserWatchlistsDropdown'
import RecommendedTv from '@/components/RecommendedTv'

const TvDetailsPage = () => {
  const { tvId } = useParams()
  const [posterLink, setPosterLink] = useState<string | undefined>('')
  const { userWatchlists } = useUserWatchlists()

  const fetchTvDetails = async () => {
    const response = await axiosBase.get(`/tv/${tvId}`)
    setPosterLink(generatePosterLink(response.data.poster_path))
    return response.data as TvDetails
  }

  const { data: tvDetails } = useQuery({ queryKey: ['tvDetails', tvId], queryFn: fetchTvDetails })

  const handlePosterError = () => {
    setPosterLink("https://placehold.co/400x600?text=Poster+Unavailable&font=lato")
  }

  return tvDetails ? (
    <div className='mx-10 md:mx-20 my-10'>
      <div className="mx-auto py-8 xl:max-w-[1400px] 2xl:max-w-[1600px]">
        <div className='flex flex-col items-center sm:flex-row pb-8 sm:py-8'>
          <img className='aspect-[2/3] sm:mr-8 sm:max-h-[350px] md:max-h-[400px] rounded-lg' src={posterLink} alt={tvDetails.name} onError={handlePosterError} />

          <div className='flex flex-col p-4 flex-1'>
            <div className='flex items-center flex-wrap'>
              <h3 className='text-xl md:text-3xl mr-4 font-bold font-merriweather'>{tvDetails.name}</h3>
              <h4 className='text-sm md:text-xl font-medium text-gray-500'>{tvDetails.first_air_date.slice(0, 4)}</h4>
            </div>
            <div className='flex mt-2 flex-wrap text-sm md:text-base'>
              <p className='mr-2'>{tvDetails.seasons.length} Seasons</p>
              <div className='flex flex-wrap gap-x-2 font-semibold'>
                {tvDetails.genres.map(genre => (
                  <p key={genre.id}>{genre.name}</p>
                ))}
              </div>
            </div>
            <div className='flex flex-col mt-4 gap-4'>
              <div>
                <p className={`mt-2 md:mt-4 tracking-wider  text-sm md:text-lg italic font-medium ${tvDetails.tagline ? '' : 'hidden'}`}>"{tvDetails.tagline}"</p>
                <p className='mt-2 text-sm md:text-lg max-w-[600px]'>{tvDetails.overview}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='max-w-[150px] md:max-w-[200px] text-sm md:text-lg '>Add to Watchlist</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side={"right"}>
                  {
                    userWatchlists &&
                    <UserWatchlistsDropdown userWatchlists={userWatchlists} tv={tvDetails} />
                  }
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Recommended TV Shows */}
        <RecommendedTv tvDetails={tvDetails} />

      </div>
    </div>
  ) : null
}

export default TvDetailsPage

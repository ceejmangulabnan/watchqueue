import { useQuery } from "@tanstack/react-query"
import axiosBase from '@/api/axios'
import MovieItem from "@/components/Movies/MovieItem"
import { MovieDataQuery } from "@/types/MovieTypes"
import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PopularMovies = () => {
  const movieContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)

  const fetchPopularMovies = async () => {
    const response = await axiosBase.get('/movies/popular')
    return response.data as MovieDataQuery
  }

  const { data: popularMovies, isLoading } = useQuery({ queryKey: ['popularMovies'], queryFn: fetchPopularMovies })

  const updateButtonVisibility = () => {
    if (movieContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = movieContainerRef.current

      setShowLeftButton(scrollLeft > 0)
      setShowRightButton(scrollWidth > clientWidth)
    }
  }

  useEffect(() => {
    const scrollContainer = movieContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateButtonVisibility)
      // Initial update
      updateButtonVisibility()
      return () => {
        scrollContainer.removeEventListener("scroll", updateButtonVisibility)
      }
    }
  }, [])

  // Check scroll container once data has finished loading to get accurate dimensions
  useEffect(() => {
    if (!isLoading && movieContainerRef.current) {
      setTimeout(updateButtonVisibility, 0)
    }

  }, [popularMovies])

  const scrollLeft = () => {
    if (movieContainerRef.current) {
      movieContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
      updateButtonVisibility()
    }
  }

  const scrollRight = () => {
    if (movieContainerRef.current) {
      movieContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
      updateButtonVisibility()
    }
  }

  return (
    <div className='mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]'>
      <h3 className="text-base md:text-xl font-semibold py-4 ">Popular Movies</h3>
      <div className='flex space-x-4 h-[200px]'>
        <div className='relative w-full'>
          {/* Left Gradient Overlay */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300 ease-in-out 
            ${showLeftButton ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)'
            }}
          />

          {/* Right Gradient Overlay */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300 ease-in-out 
            ${showRightButton ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)'
            }}
          />

          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 rounded-full p-2 
            hover:bg-black/70 transition-all duration-300 ease-in-out
            ${showLeftButton
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-75 pointer-events-none'}`}
          >
            <ChevronLeft className="text-white" />
          </button>

          {/* Right Scroll Button */}
          <button
            onClick={scrollRight}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 rounded-full p-2 
            hover:bg-black/70 transition-all duration-300 ease-in-out
            ${showRightButton
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-75 pointer-events-none'}`}
          >
            <ChevronRight className="text-white" />
          </button>

          {/* Movie items container */}
          <div
            ref={movieContainerRef}
            className="flex items-center space-x-4 overflow-x-scroll overflow-hidden scroll-smooth h-[350px]"
          >
            {popularMovies?.results.map((movie) => (
              <div
                className="flex-shrink-0 w-[180px]"
                key={movie.id}
              >
                <MovieItem movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >
  )
}

export default PopularMovies

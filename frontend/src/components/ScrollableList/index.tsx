import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MovieDataQuery } from '@/types/MovieTypes'
import { TvDataQuery } from '@/types/TvTypes'
import TvItem from '@/components/TvItem'
import MovieItem from '@/components/Movies/MovieItem'

interface ScrollableListProps {
  scrollableItems: MovieDataQuery | TvDataQuery
  isDataLoading: boolean
}

const ScrollableList = ({ scrollableItems, isDataLoading }: ScrollableListProps) => {
  const movieContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)

  const updateButtonVisibility = useCallback(() => {
    if (movieContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = movieContainerRef.current

      setShowLeftButton(scrollLeft > 0)
      setShowRightButton(scrollWidth > clientWidth + scrollLeft)
    }
  }, [])

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
  }, [updateButtonVisibility])

  // Check scroll container once data has finished loading to get accurate dimensions
  useEffect(() => {
    if (!isDataLoading && movieContainerRef.current) {
      setTimeout(updateButtonVisibility, 0)
    }

  }, [isDataLoading, scrollableItems])

  const scrollLeft = () => {
    if (movieContainerRef.current) {
      movieContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (movieContainerRef.current) {
      movieContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className='flex space-x-4 h-[350px]'>
      <div className='relative w-full'>
        {/* Left Gradient Overlay */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-16 z-10 
            pointer-events-none transition-opacity duration-300 ease-in-out 
            bg-gradient-to-r from-background to-background/0
            ${showLeftButton ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Right Gradient Overlay */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-16 z-10 
            pointer-events-none transition-opacity duration-300 ease-in-out 
            bg-gradient-to-l from-background to-background/0
            ${showRightButton ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Left Scroll Button */}
        <button
          onClick={scrollLeft}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-foreground/50 rounded-full p-2 
            hover:bg-foreground/70 transition-all duration-300 ease-in-out
            ${showLeftButton
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-75 pointer-events-none'}`}
        >
          <ChevronLeft className="text-background" />
        </button>

        {/* Right Scroll Button */}
        <button
          onClick={scrollRight}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-foreground/50 rounded-full p-2 
            hover:bg-foreground/70 transition-all duration-300 ease-in-out
            ${showRightButton
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-75 pointer-events-none'}`}
        >
          <ChevronRight className="text-background" />
        </button>

        {/* Scrollable Items Container */}
        <div
          ref={movieContainerRef}
          className="flex items-center space-x-4 overflow-x-scroll  scroll-smooth h-[350px]"
        >
          {scrollableItems?.results.map((item) => (
            <div
              className="flex-shrink-0 w-[180px]"
              key={item.id}
            >
              {
                'release_date' in item ?
                  <MovieItem movie={item} />
                  : 'first_air_date' in item ?
                    <TvItem tv={item} />
                    : null
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ScrollableList

import { useRef, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import TvItem from '@/components/TvItem'
import { TvDataQuery } from '@/types/TvTypes'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PopularTv = () => {
  const tvContainterRef = useRef<HTMLDivElement>()
  const axiosPrivate = useAxiosPrivate()
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)



  return (
    <div className='mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]'>
      <h3 className="text-base md:text-xl font-semibold py-4 ">Popular TV Shows</h3>
      <div className='flex space-x-4 h-[350px]'>
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


        </div>
      </div>
    </div>
  )
}

export default PopularTv

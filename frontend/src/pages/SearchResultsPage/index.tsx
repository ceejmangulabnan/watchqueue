import { Outlet } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("query")
  return (
    <div className='mx-10 md:mx-20 my-10'>
      <div className='mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]'>
        <h3 className='text-xl font-semibold' >Search Results for
          <span className='italic font-normal mx-2'>"{searchQuery}":</span>
        </h3>
        <Outlet />
      </div>
    </div>
  )
}

export default SearchResultsPage

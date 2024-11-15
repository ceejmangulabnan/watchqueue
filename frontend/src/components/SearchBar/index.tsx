import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useState } from 'react'
import { MovieDataQuery } from '@/types/MovieTypes'

const SearchBar = () => {
  const axiosPrivate = useAxiosPrivate()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const fetchSearchMovie = async () => {
    const response = await axiosPrivate.get(`/search/movie?query=${searchQuery}`)
    return response.data as MovieDataQuery
  }

  const { data: movieSearchResults, refetch } = useQuery({
    queryKey: ["movieSearchResults", searchQuery],
    queryFn: fetchSearchMovie,
    enabled: false
  })
  console.log(movieSearchResults)


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    refetch()
  }

  return (
    <div id='searchBar' className=''>
      <form onSubmit={handleSubmit}>
        <Input placeholder='Search...' className='w-[400px]' value={searchQuery} onChange={handleChange} />
      </form>
    </div>
  )
}

export default SearchBar

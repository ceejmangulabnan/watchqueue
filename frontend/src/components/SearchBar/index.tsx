import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search/movie?query=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className='flex-1 min-w-[100px] max-w-[600px]'>
      <form onSubmit={handleSubmit}>
        <Input placeholder='Search...' className='' value={searchQuery} onChange={handleChange} />
      </form>
    </div>
  )
}

export default SearchBar

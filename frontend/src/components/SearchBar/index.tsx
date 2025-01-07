import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchCategory, setSearchCategory] = useState<string>('All')
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      switch (searchCategory) {
        case "All":
          navigate(`/search/multi?query=${encodeURIComponent(searchQuery)}`)
          break
        case "Movies":
          navigate(`/search/movie?query=${encodeURIComponent(searchQuery)}`)
          break
        case "TV":
          navigate(`/search/tv?query=${encodeURIComponent(searchQuery)}`)
          break
      }
    }
  }

  return (
    <div className='flex-1 min-w-[100px] max-w-[600px]'>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center shadow-sm border border-input rounded-sm overflow-hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className='border-none shadow-none w-28 justify-between rounded-none'>{searchCategory}
                <ChevronDown size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-28'>
              <DropdownMenuItem onClick={() => setSearchCategory('All')}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchCategory('Movies')}>
                Movies
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchCategory('TV')}>
                TV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input placeholder='Search watchqueue...' className='border-none shadow-none' value={searchQuery} onChange={handleChange} />
        </div>
      </form>
    </div>
  )
}

export default SearchBar

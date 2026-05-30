import { Input } from '@/components/ui/input'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, Search } from 'lucide-react'

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [searchCategory, setSearchCategory] = useState<string>('All')
    const [isExpanded, setIsExpanded] = useState(false)
    const navigate = useNavigate()
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            switch (searchCategory) {
                case 'All':
                    navigate(
                        `/search/multi?query=${encodeURIComponent(searchQuery)}&page=1`
                    )
                    break
                case 'Movies':
                    navigate(
                        `/search/movie?query=${encodeURIComponent(searchQuery)}&page=1`
                    )
                    break
                case 'TV':
                    navigate(
                        `/search/tv?query=${encodeURIComponent(searchQuery)}&page=1`
                    )
                    break
            }
            setIsExpanded(false)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsExpanded(false)
                setSearchQuery('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isExpanded])

    return (
        <div ref={containerRef}>
            {isExpanded ? (
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center shadow-sm border border-input rounded-sm overflow-hidden text-sm md:text-medium">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className="border-none shadow-none w-28 justify-between rounded-none"
                                >
                                    {searchCategory}
                                    <ChevronDown size={20} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-28">
                                <DropdownMenuItem
                                    onClick={() => setSearchCategory('All')}
                                >
                                    All
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setSearchCategory('Movies')}
                                >
                                    Movies
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setSearchCategory('TV')}
                                >
                                    TV
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Input
                            ref={inputRef}
                            placeholder="Search watchqueue..."
                            className="border-none shadow-none"
                            value={searchQuery}
                            onChange={handleChange}
                        />
                    </div>
                </form>
            ) : (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(true)}
                >
                    <Search size={20} />
                </Button>
            )}
        </div>
    )
}

export default SearchBar

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { TWatchlistItem } from '@/components/WatchlistTableView'
import { Row } from '@tanstack/react-table'
import { WatchlistData } from '@/types/WatchlistTypes'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

interface StatusPickerProps {
  row: Row<TWatchlistItem>
  watchlistDetails: WatchlistData | undefined
}

const TagsPicker = ({ row, watchlistDetails }: StatusPickerProps) => {
  const [selectedTags, setSelectedTags] = useState<Array<string>>(row.original.tags)
  const axiosPrivate = useAxiosPrivate()

  const updateTags = () => {
    return axiosPrivate.put(`/watchlists/${watchlistDetails?.id}/tags`, selectedTags)
  }

  const updateTagsMutation = useMutation({
    mutationFn: updateTags
  })

  // Handle Duplicates
  const handleAddTag = (tag: string) => {
    // Check for duplicates, then add new selected item to selectedTags
    if (!selectedTags.includes(tag))
      setSelectedTags((prev) => [...prev, tag])
  }

  const filteredTags = watchlistDetails?.all_tags.filter(tag => !selectedTags.includes(tag))

  const handleSubmitTag = async () => {
    updateTagsMutation.mutateAsync
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='h-full w-full'>
        {
          !selectedTags.length ? <p>Add Tags</p>
            :
            (
              <div>
                {
                  selectedTags.map(tag => (
                    <p>{tag}</p>
                  ))
                }
              </div>
            )
        }
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[15rem]'>
        <form onSubmit={handleSubmitTag}>
          <Input />
        </form>
        {
          filteredTags?.map((tag) => (
            <DropdownMenuItem onClick={() => handleAddTag(tag)}>{tag}</DropdownMenuItem>
          ))
        }
        <DropdownMenuItem>
          <button className='text-red-500' onClick={() => setSelectedTags([])}>Remove All Tags</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TagsPicker
